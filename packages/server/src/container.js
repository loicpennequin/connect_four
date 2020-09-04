import { asClass, createContainer } from 'awilix';
import { UserService } from '@root/modules/user';
import { GameService } from '@root/modules/game';
import { GameLogic } from '@root/modules/game';
import { AuthService } from '@root/modules/auth';
import { MessageService } from '@root/modules/message';
import { PasswordService, TokenService } from '@root/modules/core';
import { WebSocketService } from './modules/core/WebSocketService';

export const container = createContainer();

container.register({
  userService: asClass(UserService).scoped(),
  gameService: asClass(GameService).scoped(),
  gameLogic: asClass(GameLogic).scoped(),
  authService: asClass(AuthService).scoped(),
  messageService: asClass(MessageService).scoped(),
  passwordService: asClass(PasswordService).scoped(),
  tokenService: asClass(TokenService).scoped(),
  webSocketService: asClass(WebSocketService).singleton()
});
