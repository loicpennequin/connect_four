import { isDefined } from '@c4/shared';
import { httpClient } from '@core/api/httpClient';

let _jwt;

export class AuthService {
  static get jwt() {
    return `Bearer ${_jwt}`;
  }

  static get jwtPayload() {
    if (!_jwt) return null;

    return JSON.parse(
      Buffer.from(_jwt.split('.')[1], 'base64').toString('binary')
    );
  }
  
  static onRequest(url, options) {
    if (isDefined(_jwt)) {
      options.headers.set('Authorization', AuthService.jwt);
    }

    return [url, options];
  }

  static async refreshJwt() {
    try {
      const { token } = await httpClient.get(`/auth/refresh_token`);
      _jwt = token;
    } catch (err) {
      throw err;
    }
  }

  static async login(credentials) {
    try {
      const { token } = await httpClient.post(`/auth/login`, {
        body: credentials
      });
      _jwt = token;
    } catch (err) {
      throw err;
    }
  }
}
