class WebSocketApi {
  _ws = null;
  _listeners = new Map();
  _clientId;

  get ws() {
    return this._ws;
  }

  get isConnected() {
    return this._ws.readyState === WebSocket.OPEN;
  }

  _checkConnected(message) {
    if (!this.isConnected) {
      throw new Error(message);
    }
  }

  _onMessage(message) {
    const { eventName, data } = JSON.parse(message.data);
    if (!this._listeners.has(eventName)) return;
    this._listeners.get(eventName).forEach(cb => cb(data));
  }
  
  connect() {
    return new Promise(resolve => {
      this._ws = new WebSocket(process.env.REACT_APP_WEBSOCKETS_URL);
      this._ws.addEventListener('message', this._onMessage.bind(this));

      this.on('connected', ({ clientId }) => {
        this._clientId = clientId;
        resolve()
      })
    })
  }

  disconnect() {
    if (this.isConnected) this._ws.close();
  }

  emit(eventName, data) {
    this._checkConnected(
      `Tried to emit event ${eventName} but socket is not connected !`
    );

    this._ws.send(JSON.stringify({ eventName, clientId: this._clientId, data }));
  }

  on(eventName, cb) {
    if (this._listeners.has(eventName)) {
      this._listeners.get(eventName).push(cb);
    } else {
      this._listeners.set(eventName, [cb]);
    }

    return function off() {
      this.off(eventName, cb);
    };
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
