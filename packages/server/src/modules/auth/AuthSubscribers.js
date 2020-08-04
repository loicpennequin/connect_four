import { constants } from '@c4/shared';
import { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';
import { withLog } from '@root/logger';
import { UserSerializer } from '@root/modules/user';

export class AuthSubscribers {
  constructor(container) {
    this.websocketService = container.resolve('webSocketService');
    this.userService = container.resolve('userService');

    this.websocketService.on(constants.EVENTS.CLOSE, this.onClose.bind(this));

    this.websocketService.on(
      constants.EVENTS.CONNECTED,
      this.onConnected.bind(this)
    );
  }

  @withLog()
  @wrap()
  async onClose(ws) {
    if (!ws.userId) return;

    const user = await this.userService.findById(ws.userId);
    await this.userService.update(ws.userId, { isOnline: false });
    this.websocketService.broadcastToOthers(
      constants.EVENTS.USER_LEFT_LOBBY,
      { id: user.id },
      ws.userId
    );
  }

  @withLog()
  @wrap()
  async onConnected(ws) {
    if (!ws.userId) return;

    let user = await this.userService.findById(ws.userId);
    if (!user.is_online) {
      user = await this.userService.update(ws.userId, { isOnline: true });
    }

    this.websocketService.broadcastToOthers(
      constants.EVENTS.USER_ENTERED_LOBBY,
      UserSerializer.toDTO(user),
      user.id
    );
  }
}
