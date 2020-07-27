import { createLogger, format, transports } from 'winston';
import config from '@root/config';
import { isDev, isObject, getParamNames } from '@c4/shared';

class LogService {
  constructor() {
    this._initLogger();
    this.decorator = this.decorator.bind(this);
    this.middleware = this.middleware.bind(this);
  }

  _initLogger() {
    this._logger = createLogger({
      level: config.LOGGER.LOG_LEVEL,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      transports: [
        new transports.File({
          filename: 'logs/error.log',
          level: 'error'
        }),
        new transports.File({ filename: 'logs/combined.log' })
      ]
    });

    if (isDev) {
      this._logger.add(
        new transports.Console({
          level: config.LOGGER.LOG_LEVEL,
          format: format.combine(
            format(info => {
              info.level = info.level.toUpperCase();
              return info;
            })(),
            format.errors({ stack: true }),
            format.colorize({ all: true }),
            format.timestamp({
              format: 'HH:mm:ss'
            }),
            format.printf(info => {
              const isError = info[Symbol.for('level')] === 'error';
              const stack =
                isError && !info.hideStackTrace && info.stack
                  ? `\n \u001b[31m${info.stack}\u001b[39m`
                  : '';
              const originalError =
                isError && info.originalError
                  ? `\n[${info.timestamp}] ${info.level}:\tORIGINAL ERROR: ${info.originalError.message}`
                  : '';
              return `[${info.timestamp}] ${info.level}:\t${info.message}${originalError}${stack}`;
            })
          )
        })
      );
    }
  }

  middleware(req, res, next) {
    // prevents logs pollution in graphQL playground
    if (
      req.body?.operationName !== 'IntrospectionQuery' &&
      !req.url.endsWith('.js')
    ) {
      this.logger.info(`===========================`);
      this.logger.info(
        `[${req.method}]\t - ${req.url} ${
          req.url === '/graphql' && req.method === 'POST'
            ? ' - ' + req.body?.operationName
            : ''
        }`
      );
    }
    next();
  }

  decorator(showParams = false) {
    return (target, key, descriptor) => {
      const paramNames = getParamNames(descriptor.value);
      const fn = descriptor.value;
      const logger = this.logger;
      descriptor.value = function(...args) {
        if (typeof target === 'function') {
          logger.debug(`${target.name}.${key}()`);
        } else {
          logger.debug(`${target.constructor.name}.${key}()`);
        }

        if (showParams) {
          paramNames.forEach((param, i) => {
            const value = args[i];
            const message = `----${param}: ${
              isObject(value) ? JSON.stringify(value) : value
            }`;
            logger.debug(
              message.length > 100 ? message.slice(0, 100) + '...' : message
            );
          });
        }
        return fn.call(this, ...args);
      };
    };
  }

  debug(...args) {
    this._logger.debug(...args);
  }

  info(...args) {
    this._logger.info(...args);
  }

  warn(...args) {
    this._logger.warn(...args);
  }

  error(...args) {
    this._logger.error(...args);
  }

  get logger() {
    return this._logger;
  }
}

const logger = new LogService();

export const withLog = logger.decorator;
export default logger;
