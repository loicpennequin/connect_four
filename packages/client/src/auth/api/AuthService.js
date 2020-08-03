import { isDefined } from '@c4/shared';
import { httpClient } from '@core/api/httpClient';

let _jwt;

export class AuthService {
  static get jwt() {
    return _jwt;
  }

  static getJwtPayload() {
    if (!_jwt) return null;

    return JSON.parse(
      Buffer.from(_jwt.split('.')[1], 'base64').toString('binary')
    );
  }

  static onRequest(url, options) {
    if (isDefined(_jwt)) {
      options.headers.set('Authorization', `Bearer ${_jwt}`);
    }

    return [url, options];
  }

  static async onResponseError(error) {
    if (
      error.statusCode === 401 &&
      error.request.headers.has('Authorization') &&
      !error.request.url.includes('refresh_token')
    ) {
      await AuthService.refreshJwt();
      _jwt = null;
      error.request.headers.delete('Authorization');
      httpClient.get[error.request.method](error.request.url, {
        ...error.request
      });
    }
    return error;
  }

  static async refreshJwt() {
    const { token } = await httpClient.get(`/auth/refresh_token`);
    _jwt = token;
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
  
  static async logout(credentials) {
    try {
      await httpClient.get(`/auth/logout`);
      _jwt = null;
    } catch (err) {
      throw err;
    }
  }
}
