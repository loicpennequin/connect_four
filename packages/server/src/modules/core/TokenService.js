import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import config from '@root/config';
import { withLog } from '@root/logger';
import errors from '@root/modules/core/ErrorFactory';

export class TokenService {
  cookieOptions = {
    ...config.COOKIE,
    secret: config.SESSION.SECRET
  };

  @withLog()
  generateJWT(userId) {
    return jwt.sign({ sub: userId }, config.JWT.SECRET, {
      expiresIn: config.JWT.MAXAGE,
      issuer: config.JWT.ISSUER
    });
  }

  @withLog()
  generateRefreshToken() {
    return jwt.sign(
      { sub: crypto.randomBytes(20).toString('hex') },
      config.REFRESH_TOKEN.SECRET,
      {
        expiresIn: config.REFRESH_TOKEN.MAXAGE,
        issuer: config.REFRESH_TOKEN.ISSUER
      }
    );
  }

  @withLog()
  verifyRefreshToken(token) {
    if (!token) throw errorFactory.unauthorized();
    try {
      return jwt.verify(token, config.REFRESH_TOKEN.SECRET, {
        maxAge: config.REFRESH_TOKEN.MAXAGE,
        issuer: config.REFRESH_TOKEN.ISSUER
      });
    } catch {
      throw errorFactory.tokenExpired();
    }
  }
}
