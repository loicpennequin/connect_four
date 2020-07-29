import logger from '@root/logger';
import { isProd } from '@c4/shared';

export class ApplicationError extends Error {
  constructor(message, errorType, additionalProps) {
    super(message);
    this.errorType = errorType;
    this.isApplicationError = true;
    Object.assign(this, additionalProps);
  }
}

function handle(error) {
  logger.error(error);
  return error;
}

const errors = {
  unauthorized: (
    message = 'Authentication is required to access this ressource.',
    additionalProps = {}
  ) =>
    new ApplicationError(message, 'UNAUTHORIZED', {
      hideStackTrace: true,
      statusCode: 401,
      ...additionalProps
    }),

  forbidden: (
    message = 'You do not have the rights to access this resource.',
    additionalProps = {}
  ) =>
    new ApplicationError(message, 'FORBIDDEN', {
      hideStackTrace: true,
      statusCode: 403,
      ...additionalProps
    }),

  notFound: (message = 'Resource not found', additionalProps = {}) =>
    new ApplicationError(message, 'NOT_FOUND', {
      hideStackTrace: true,
      statusCode: 404,
      ...additionalProps
    }),

  validationError: (message = 'Invalid input.', additionalProps = {}) =>
    new ApplicationError(message, 'VALIDATION_ERROR', {
      hideStackTrace: true,
      statusCode: 400,
      ...additionalProps
    }),

  tokenExpired: (message = 'Your token has expired.', additionalProps = {}) =>
    new ApplicationError(message, 'TOKEN_EXPIRED', {
      hideStackTrace: true,
      statusCode: 401,
      ...additionalProps
    }),

  unexpected: (
    message = 'An unexpected error has occured',
    additionalProps = {}
  ) =>
    new ApplicationError(message, 'INTERNAL_SERVER_ERROR', {
      statusCode: 500,
      ...additionalProps
    })
};

export const wrapRequest = (defaultError = errors.unexpected()) => promise => {
  return async function wrapped(req, res, next) {
    try {
      return await promise(req, res, next);
    } catch (err) {
      let handledError;
      if (err instanceof ApplicationError) handledError = handle(err);
      else {
        defaultError.originalError = err;
        handledError = handle(defaultError);
      }
      res.status(handledError.statusCode).json({
        error: {
          message: handledError.message,
          statusCode: handledError.statusCode,
          type: handledError.errorType
        }
      });
    }
  };
};

export const wrapRequestDecorator = (error = errors.unexpected()) => (
  target,
  key,
  descriptor
) => {
  const promise = descriptor.value;
  descriptor.value = function decorated(...args) {
    return wrapRequest(error)(promise.bind(this))(...args);
  };
  return descriptor;
};

export default errors;
