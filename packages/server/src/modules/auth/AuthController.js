import { withLog } from '@root/logger';
import config from '@root/config';
import errors, {
  wrapRequestDecorator as wrap
} from '@root/modules/core/ErrorFactory';

export class AuthController {
  constructor({ authService }) {
    this.authService = authService;
  }

  _setCookie(res, value) {
    res.cookie('refresh_token', value, {
      path: config.COOKIE.PATH,
      secure: config.COOKIE.SECURE,
      sameSite: config.COOKIE.SAMESITE,
      maxAge: config.COOKIE.MAXAGE,
      httpOnly: config.COOKIE.HTTPONLY
    });
  }

  @withLog()
  @wrap(errors.unauthorized())
  async login(req, res) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.body
    );

    this._setCookie(res, refreshToken);
    res.json({ token: accessToken });
  }

  @withLog()
  @wrap()
  async refreshToken(req, res) {
    const {
      accessToken,
      refreshToken
    } = await this.authService.refreshAccessToken(req.cookies?.refresh_token);

    this._setCookie(res, refreshToken);
    res.json({ token: accessToken });
  }

  @withLog()
  @wrap()
  async logout(req, res) {
    res.clearCookie('refresh_token');
    await this.authService.logout(req.user);

    req.sendStatus(204);
  }
}
