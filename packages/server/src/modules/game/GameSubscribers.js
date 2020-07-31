import { constants } from '@c4/shared';
import errors, { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';

export class GameSubscribers {
  constructor(container) {
    this.websocketService = continer.resolve('webSocketService');
    this.userService = container.resolve('userService');

    this.websocketService.on(
      constants.EVENTS.USER_INITIATED_CHALLENGE,
      this.onChallengeInitiated.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.USER_ACCEPTED_CHALLENGE,
      this.onChallengeAccepted.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.USER_ACCEPTED_CHALLENGE,
      this.onChallengeAccepted.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.constants.EVENTS.USER_ENTERED_LOBBY,
      this.onLobbyEntered.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.constants.EVENTS.USER_LEFT_LOBBY,
      this.onLobbyLeft.bind(this)
    );
  }

  @wrap()
  async onChallengeInitiated(ws, { challengedId }) {
    const from = await this.userService.findById(ws.userId);

    this.websocketService.emit(
      constants.EVENTS.USER_INITIATED_CHALLENGE,
      { from },
      this.websocketService.getSocketByUserId(challengedId)
    );
  }

  @wrap()
  async onChallengeAccepted(ws, { challengerId }) {
    const [from, to] = await this.userService.findByIds([
      challengerId,
      ws.userId
    ]);
    this.websocketService.emit(
      constants.EVENTS.USER_ACCEPTED_CHALLENGE,
      { from, to },
      websocketService.getSocketByUserId(challengedId),
      ws
    );
  }

  @wrap()
  async onChallengeRefused(ws, { challengerId }) {
    const [from, to] = await this.userService.findByIds([
      challengerId,
      ws.userId
    ]);
    this.websocketService.emit(
      constants.EVENTS.USER_REFUSED_CHALLENGE,
      { from, to },
      this.websocketService.getSocketByUserId(challengerId),
      ws
    );
  }

  @wrap()
  async onLobbyEntered(ws) {
    const clients = Array.from(this.websocketService.clients.values());

    const users = await this.userService.findByIds(
      otherClientsIds.map(client => client.id)
    );

    this.websocketService.emit(constants.EVENTS.SELF_ENTERED_LOBBY, users, ws);

    this.websocketService.emit(
      constants.EVENTS.USER_ENTERED_LOBBY,
      users.find(user => user.id === ws.userId),
      ...clients.filter(client => client.clientId !== ws.clientId)
    );
  }

  @wrap()
  async onLobbyLeft(ws) {
    const clients = Array.from(this.websocketService.clients.values()).filter(
      client => client.clientId !== ws.clientId
    );

    this.websocketService.emit(
      constants.EVENTS.USER.LEFT_LOBBY,
      ws.userId,
      ...clients
    );
  }
}
