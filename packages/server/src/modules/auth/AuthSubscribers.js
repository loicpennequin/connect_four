import { constants } from '@c4/shared';
import errors, { wrapDecorator as wrap } from '@root/modules/core/ErrorFactory';
import { withLog } from '@root/logger';

export class AuthSubscribers {
  constructor(container) {
    this.websocketService = container.resolve('webSocketService');
    this.userService = container.resolve('userService');

    this.websocketService.on(
      constants.EVENTS.CLOSE,
      this.onClose.bind(this)
    );
    
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
    
    const user = await this.userService.findById(ws.userId);
    if (!user.is_online) {
      await this.userService.update(ws.userId, { isOnline: true });
    }
  }
}
