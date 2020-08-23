import express from 'express';
import http from 'http';
import { scopePerRequest } from 'awilix-express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import enforce from 'express-sslify';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import WebSocket from 'ws';
import { asValue } from 'awilix';
import { isProd, isUndefined } from '@c4/shared';

import config from '@root/config';
import logger from '@root/logger';
import { container } from '@root/container';
import { DatabaseService, WebSocketService } from '@root/modules/core';
import { userRoutes } from '@root/modules/user';
import { gameRoutes } from '@root/modules/game';
import { authRoutes, AuthService } from '@root/modules/auth';
import { GameService } from '@root/modules/game';
import errors, { serializeError } from '@root/modules/core/ErrorFactory';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
container.register({
  wss: asValue(wss)
});

if (isProd) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(compression());
} else {
  app.use(logger.middleware);
}

app.use(
  cors({
    origin(origin, cb) {
      if (config.WEBSITE_URL === origin || isUndefined(origin)) cb(null, true);
      else cb(new Error('CORS'));
    },
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser(config.SESSION.SECRET));
app.use(passport.initialize());
app.use(scopePerRequest(container));
app.use('/users', userRoutes);
app.use('/games', gameRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.json({version: '1.0.0'});
});
app.use('*', (req, res) =>
  res.status(404).json(serializeError(errors.notFound()))
);

server.start = async function() {
  AuthService.initialize(container);
  WebSocketService.initialize(container);
  GameService.initialize(container);
  await DatabaseService.initialize(container);

  return server.listen(config.PORT, () => {
    logger.info('================API READY================');
    logger.info(`PORT: ${config.PORT}`);
    logger.info(`ENVIRONMENT: ${config.ENV}`);
  });
};

export default server;
