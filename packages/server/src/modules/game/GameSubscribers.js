import { constants } from '@c4/shared';
import { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';
import { withLog } from '@root/logger';
import { UserSerializer } from '@root/modules/user';

export class GameSubscribers {
  constructor(container) {
    this.websocketService = container.resolve('webSocketService');
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
  }

  @withLog(true)
  @wrap()
  async _defaultChallengeHandler({
    responseEventName,
    clientsToNotify,
    playerIds
  }) {
    const [challenger, challenged] = (
      await this.userService.findByIds(playerIds)
    ).map(UserSerializer.toDTO);

    this.websocketService.emit(
      responseEventName,
      { challenger, challenged },
      ...clientsToNotify
    );
  }

  @withLog()
  @wrap()
  async onChallengeInitiated(ws, { challengedId, challengerId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_INITIATED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengedId)],
      playerIds: [challengerId, challengedId]
    });
  }

  @withLog()
  @wrap()
  async onChallengeCancelled(ws, { challengedId, challengerId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_CANCELLED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengedId)],
      playerIds: [challengerId, challengedId]
    });
  }

  @withLog()
  @wrap()
  async onChallengeAccepted(ws, { challengerId, challengedId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_ACCEPTED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengerId)],
      playerIds: [challengerId, challengedId]
    });
  }

  @withLog()
  @wrap()
  async onChallengeRefused(ws, { challengerId, challengedId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_REFUSED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengerId)],
      playerIds: [challengerId, challengedId]
    });
  }
}
