import { v4 as uuid } from 'uuid';
import { noop } from '@c4/shared';

import logger, { withLog } from '@root/logger';

const HEARTBEAT_INTERVAL = 15000;

export class WebSocketService {
  static initialize(container) {
    container.resolve('webSocketService');
  }

  constructor({ wss }) {
    this.wss = wss;
    this.wss.on('connection', this._onConnect.bind(this));
    this.wss.on('close', this._onClose.bind(this));
    this.clients = new Map();
    this._listeners = new Map();

    this._heartbeat = setInterval(
      this._doHealthCheck.bind(this),
      HEARTBEAT_INTERVAL
    );
  }

  _doHealthCheck() {
    this.wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        logger.info(`client ${ws.clientId} not alive. Closing.`);
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(noop);
    });
  }

  _onConnect(ws) {
    const clientId = uuid();
    logger.debug(`WS: connected: ${lientId}`);
    ws.clientId = clientId;
    ws.isAlive = true;
    this.clients.set(clientId, ws);

    ws.on('message', message => this._onMessage(ws, message));
    ws.on('close', () => this._onClientClose(ws));
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    ws.send(this.createMessage('connected', { clientId }));
  }

  _onClose() {
    clearInterval(this._heartbeat);
  }

  _onClientClose(ws) {
    logger.debug(`WS: disconnected: ${lientId}`);
    this._onMessage(ws, '{"eventName": "close"}');
    this.clients.delete(ws.clientId);
  }

  _onMessage(ws, message) {
    logger.debug(`WS: new message: ${message}`);
    const { eventName, data } = JSON.parse(message);
    const listeners = this._listeners.get(eventName);
    if (!listeners) return;
    listeners.forEach(listener => listener(ws, data));
  }

  createMessage(eventName, data) {
    return JSON.stringify({ eventName, data });
  }

  on(eventName, cb) {
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, new Set());
    }

    if (this._listeners.get(eventName).has(cb)) {
      logger.warn(
        `Websockets.on : duplicate listener on event ${eventName}: ${cb.name}`
      );
    }

    this._listeners.get(eventName).add(cb);
  }

  @withLog(true)
  emit(eventName, data, clientId) {
    this.clients.get(clientId).send(this.createMessage(eventName, data));
  }
  
  @withLog(true)
  emitToAll(eventName, data) {
    this.clients.forEach(client => {
      client.send(this.createMessage(eventName, data));
    });
  }
}
