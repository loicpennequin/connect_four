import { AuthService } from '@auth/api/AuthService';

class WebSocketApi {
  _ws = null;
  _listeners = new Map();
  _clientId = null;
  _messageQueue = [];

  constructor() {
    this.on('connected', data => {
      this._clientId = data.clientId;
    });
  }

  get ws() {
    return this._ws;
  }

  get clientId() {
    return this._clientId;
  }

  get isConnected() {
    return this._ws?.readyState === WebSocket.OPEN;
  }

  get isConnecting() {
    return this._ws?.readyState === WebSocket.CONNECTING;
  }

  get serverUrl() {
    return `${process.env.REACT_APP_WEBSOCKETS_URL}?token=${AuthService.jwt}`;
  }

  _onMessage(message) {
    const { eventName, data } = JSON.parse(message.data);
    console.groupCollapsed(`WS:recieved: ${eventName}`);
    console.log(data);
    console.groupEnd();
    if (!this._listeners.has(eventName)) return;
    this._listeners.get(eventName).forEach(cb => cb(data));
  }

  _onOpen() {
    this._messageQueue.forEach(({ eventName, data }) => {
      this.send(eventName, data);
    });
    this._messageQueue = [];
  }

  send(eventName, data) {
    console.groupCollapsed(`WS:send: ${eventName}`);
    console.log(data);
    console.groupEnd();
    this._ws.send(JSON.stringify({ eventName, data }));
  }

  connect() {
    if (this.isConnected || this.isConnecting) return;
    this._ws = new WebSocket(this.serverUrl);
    this._ws.addEventListener('message', this._onMessage.bind(this));
    this._ws.addEventListener('open', this._onOpen.bind(this));
  }

  disconnect() {
    if (this.isConnected) {
      this._ws.close();
    }
  }

  emit(eventName, data) {
    if (!this.isConnected) {
      this._messageQueue.push({ eventName, data });
    } else {
      this.send(eventName, data);
    }
  }

  on(eventName, cb) {
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, [cb]);
    } else {
      const isDuplicate = this._listeners
        .get(eventName)
        .map(cb => cb.toString())
        .includes(cb.toString());
      if (isDuplicate) {
        console.warn(`duplicate socket listener for ${eventName}`, cb);
      } else {
        this._listeners.get(eventName).push(cb);
      }
    }

    return () => this.off(eventName, cb);
  }

  off(eventName, cb) {
    if (!this._listeners.has(eventName)) return;

    this._listeners.set(
      eventName,
      this._listeners.get(eventName).filter(handler => handler !== cb)
    );
  }
}

export const webSocketApi = new WebSocketApi();
