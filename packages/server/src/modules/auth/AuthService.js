import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

import { constants } from '@c4/shared';

import { container } from '@root/container';
import { PasswordService } from '@root/modules/core';
import config from '@root/config';
import { withLog } from '@root/logger';
import { UserSerializer } from '@root/modules/user';
import errors from '@root/modules/core/ErrorFactory';

export class AuthService {
  constructor({ userService, tokenService, webSocketService }) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.webSocketService = webSocketService;
  }

  @withLog()
  static initialize(container) {
    passport.use(AuthService.createJwtStrategy(container));
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  static createJwtStrategy() {
    return new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.JWT.SECRET
      },
      async (payload, done) => {
        const user = await container.cradle.userService.findById(payload.sub);
        if (!user) return done(null, false);
        return done(null, user);
      }
    );
  }

  @withLog()
  static async ensureAuthenticated(req, res, next, cb) {
    return passport.authenticate('jwt', { session: false }, cb)(req, res, next);
  }

  @withLog()
  async login({ username, password }) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw errors.unaurhorized('Invalid credentials.');
    PasswordService.compare(password, user.password_hash);

    const accessToken = this.tokenService.generateJWT(user.id);
    const refreshToken = this.tokenService.generateRefreshToken();

    const updatedUser = await this.userService.update(user.id, {
      refreshToken
    });

    this.webSocketService.broadcast(
      constants.EVENTS.USER_LOGGED_IN,
      UserSerializer.toDTO(updatedUser)
    );

    return { refreshToken, accessToken };
  }

  @withLog(true)
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) throw errors.tokenExpired();
    const user = await this.userService.findByRefreshToken(refreshToken);

    if (!user) throw errors.unauthorized();;
    
    this.tokenService.verifyRefreshToken(user.refresh_token);

    const accessToken = this.tokenService.generateJWT(user.id);
    refreshToken = this.tokenService.generateRefreshToken();

    await this.userService.update(user.id, { refreshToken });
    return { refreshToken, accessToken };
  }

  @withLog()
  async logout(userId) {
    const user = await this.userId.update(userId, {
      refreshToken: null
    });

    this.webSocketService.broadcast(
      constants.EVENTS.USER_LOGGED_OFF,
      UserSerializer.toDTO(user)
    );
  }
}
