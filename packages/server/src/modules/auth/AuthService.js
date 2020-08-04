import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

import { constants } from '@c4/shared';

import { container } from '@root/container';
import { PasswordService } from '@root/modules/core';
import config from '@root/config';
import { withLog } from '@root/logger';
import { UserSerializer } from '@root/modules/user';
import errors, { serializeError } from '@root/modules/core/ErrorFactory';
import { AuthSubscribers } from '@root/modules/auth/AuthSubscribers';

export class AuthService {
  constructor({ userService, tokenService, webSocketService }) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.webSocketService = webSocketService;
  }

  @withLog()
  static initialize(container) {
    new AuthSubscribers(container);
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
    // @TODO fais en une methode que t'utilises en default param sale gitan
    if (!cb) {
      cb = (err, user) => {
        if (err || !user) {
          return res.status(401).json(serializeError(errors.unauthorized()));
        }
        req.user = user;
        next();
      };
    }
    return passport.authenticate('jwt', { session: false }, cb)(req, res, next);
  }

  @withLog()
  async login({ username, password }) {
    if (!username) throw errors.unauthorized();

    const user = await this.userService.findByUsername(username);
    if (!user) throw errors.unauthorized('Invalid credentials.');

    PasswordService.compare(password, user.password_hash);

    const accessToken = this.tokenService.generateJWT(user.id);
    const refreshToken = this.tokenService.generateRefreshToken();

    const updatedUser = await this.userService.update(user.id, {
      isOnline: true,
      refreshToken
    });

    return { refreshToken, accessToken };
  }

  @withLog(true)
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) throw errors.tokenExpired();
    const user = await this.userService.findByRefreshToken(refreshToken);

    if (!user) throw errors.unauthorized();

    this.tokenService.verifyRefreshToken(user.refresh_token);

    const accessToken = this.tokenService.generateJWT(user.id);
    refreshToken = this.tokenService.generateRefreshToken();

    await this.userService.update(user.id, { refreshToken });
    return { refreshToken, accessToken };
  }

  @withLog()
  async logout(userId) {
    const user = await this.userService.update(userId, {
      refreshToken: null,
      isOnline: false
    });
  }
}
