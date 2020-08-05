import url from 'url';
import { v4 as uuid } from 'uuid';
import { noop, isObject } from '@c4/shared';

import logger, { withLog } from '@root/logger';
import { AuthService } from '@root/modules/auth';

const HEARTBEAT_INTERVAL = 10000;

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
    logger.info('Websocket Server listening.');
  }

  get clientIds() {
    return Array.from(this.clients.keys());
  }

  _doHealthCheck() {
    this.wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        logger.info(`client ${ws.clientId} not alive. Closing.`);
        this
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(noop);
    });
  }

  async _onConnect(ws, req) {
    const clientId = uuid();
    logger.info(`WS: connected: ${clientId}`);

    const { token } = url.parse(req.url, true).query;
    req.headers.authorization = `Bearer ${token}`;
    
    AuthService.ensureAuthenticated(req, null, null, (err, user) => {
      if (err || !user) {
        logger.warn('Unauthenticated socket connection. Terminating.');
        return ws.close();
      }

      ws.on('message', message => this._onMessage(ws, message));
      ws.on('close', () => this._onClientClose(ws));
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.clientId = clientId;
      ws.isAlive = true;
      ws.userId = user.id;
      this.clients.set(clientId, ws);
      this._onMessage(ws, '{"eventName": "connected"}');
      ws.send(this.createMessage('connected', { clientId }));
    });
  }

  _onClose() {
    clearInterval(this._heartbeat);
  }

  _onClientClose(ws) {
    logger.info(`WS: disconnected: ${ws.clientId}`);
    this._onMessage(ws, '{"eventName": "close"}');
    this.clients.delete(ws.clientId);
  }

  _safeParse(message) {
    try {
      return JSON.parse(message);
    } catch {
      logger.error(`WS: unparsable message: ${message}`);
      return {};
    }
  }

  _onMessage(ws, message) {
    logger.debug(`WS: new message: ${message}`);
    const { eventName, data } = this._safeParse(message);
    const listeners = this._listeners.get(eventName);
    if (!listeners) return;
    listeners.forEach(listener => listener(ws, data));
  }

  createMessage(eventName, data) {
    return JSON.stringify({ eventName, data });
  }

  @withLog(true)
  getSocketByUserId(userId) {
    return [...this.clients.values()].find(client => client.userId === userId);
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
  emit(eventName, data, ...clientsOrClientIds) {
    clientsOrClientIds.forEach(clientOrClientId => {
      const ws = isObject(clientOrClientId)
        ? clientOrClientId
        : this.clients.get(clientOrClientId);
      if (!ws) {
        return logger.error(
          `WS: Invalid client or clientId: ${clientOrClientId}`
        );
      }

      ws.send(this.createMessage(eventName, data));
    });
  }

  @withLog(true)
  broadcast(eventName, data) {
    this.clients.forEach(client => {
      client.send(this.createMessage(eventName, data));
    });
  }

  @withLog(true)
  broadcastToOthers(eventName, data, from) {
    this.clients.forEach(client => {
      if (client.userId === from) return;
      client.send(this.createMessage(eventName, data));
    });
  }
}
