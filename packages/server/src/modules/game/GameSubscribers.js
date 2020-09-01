import { constants, enums } from '@c4/shared';
import { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';
import { withLog } from '@root/logger';
import { UserSerializer } from '@root/modules/user';

export class GameSubscribers {
  constructor(container) {
    this.websocketService = container.resolve('webSocketService');
    this.userService = container.resolve('userService');
    this.gameService = container.resolve('gameService');
    this._pendingChallenges = [];

    this.websocketService.on(
      constants.EVENTS.USER_INITIATED_CHALLENGE,
      this.onChallengeInitiated.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.USER_CANCELLED_CHALLENGE,
      this.onChallengeCancelled.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.USER_ACCEPTED_CHALLENGE,
      this.onChallengeAccepted.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.USER_REFUSED_CHALLENGE,
      this.onChallengeRefused.bind(this)
    );

    this.websocketService.on(
      constants.EVENTS.PLAYER_CONNECTED_TO_GAME,
      this.onPlayerConnect.bind(this)
    );

    this.websocketService.on(constants.EVENTS.CLOSE, this.onClosed.bind(this));
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
    this._pendingChallenges.push({ challengedId, challengerId });
  }

  @withLog()
  @wrap()
  async onChallengeCancelled(ws, { challengedId, challengerId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_CANCELLED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengedId)],
      playerIds: [challengerId, challengedId]
    });
    this._pendingChallenges = this._pendingChallenges.filter(
      challenge =>
        !(
          challenge.challengerId === challengerId &&
          challenge.challengedId === challengedId
        )
    );
  }

  @withLog()
  @wrap()
  async onChallengeAccepted(ws, { challengerId, challengedId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_ACCEPTED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengerId)],
      playerIds: [challengerId, challengedId]
    });

    this._pendingChallenges = this._pendingChallenges.filter(
      challenge =>
        !(
          challenge.challengerId === challengerId &&
          challenge.challengedId === challengedId
        )
    );

    const challengesToCancel = this._pendingChallenges.filter(
      challenge => challenge.challengerId === challengedId ||
      challenge.challengerId === challengerId
    )
    
    const challengesToDecline = this._pendingChallenges.filter(
      challenge =>
        challenge.challengedId === challengedId ||
        challenge.challengedId === challengerId
    );

    // TODO put this in UserSubscribers
    this.userService.update(challengerId, { status: enums.USER_STATUSES.IN_GAME});
    this.userService.update(challengedId, { status: enums.USER_STATUSES.IN_GAME});

    challengesToCancel.forEach(challenge => {
      this.onChallengeCancelled(ws, challenge);
    })
    challengesToDecline.forEach(challenge => {
      this.onChallengeRefused(ws, challenge);
    })

    this.gameService.createGameInstance(challengerId, challengedId);
  }

  @withLog()
  @wrap()
  async onChallengeRefused(_ws, { challengerId, challengedId }) {
    this._defaultChallengeHandler({
      responseEventName: constants.EVENTS.USER_REFUSED_CHALLENGE,
      clientsToNotify: [this.websocketService.getSocketByUserId(challengerId)],
      playerIds: [challengerId, challengedId]
    });
    this._pendingChallenges = this._pendingChallenges.filter(
      challenge =>
        !(
          challenge.challengerId === challengerId &&
          challenge.challengedId === challengedId
        )
    );
  }

  @withLog
  @wrap()
  async onClosed(ws) {
    // TODO refacto
    this._pendingChallenges = (
      await Promise.all(
        this._pendingChallenges.map(async challenge => {
          if (challenge.challengedId === ws.userId) {
            const [challenger, challenged] = (
              await this.userService.findByIds([
                challenge.challengerId,
                challenge.challengedId
              ])
            ).map(UserSerializer.toDTO);

            this.websocketService.emit(
              constants.EVENTS.USER_CANCELLED_CHALLENGE,
              { challenger, challenged },
              this.websocketService.getSocketByUserId(challenge.challengerId)
            );

            return null;
          }

          if (challenge.challengerId === ws.userId) {
            const [challenger, challenged] = (
              await this.userService.findByIds([
                challenge.challengerId,
                challenge.challengedId
              ])
            ).map(UserSerializer.toDTO);

            this.websocketService.emit(
              constants.EVENTS.USER_CANCELLED_CHALLENGE,
              { challenger, challenged },
              this.websocketService.getSocketByUserId(challenge.challengedId)
            );
            return null;
          }
        })
      )
    ).filter(Boolean);
  }

  @withLog()
  @wrap()
  onPlayerConnect(ws, data) {
    const rooms = this.gameService.constructor.gameRooms;
    const room = rooms.find(r => r.state.id === data.gameId);
    if (!room) {
      this.websocketService.emit(constants.EVENTS.PLAYER_CONNECTED_TO_STALE_GAME, null, ws);
    } else {
      this.websocketService.emit(constants.EVENTS.PLAYER_CONNECTED_TO_GAME, room.state, ws);
    }
  }
}
