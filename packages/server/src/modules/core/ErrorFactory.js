import logger from '@root/logger';
import { isProd, isEmptyObject } from '@c4/shared';

export class ApplicationError extends Error {
  constructor(message, errorType, { statusCode, ...additionalProps }) {
    super(message);
    this.errorType = errorType;
    this.isApplicationError = true;
    this.statusCode = statusCode;
    if (!isEmptyObject(additionalProps)) {
      this.additional = additionalProps;
    }
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
      statusCode: 401,
      ...additionalProps
    }),

  forbidden: (
    message = 'You do not have the rights to access this resource.',
    additionalProps = {}
  ) =>
    new ApplicationError(message, 'FORBIDDEN', {
      statusCode: 403,
      ...additionalProps
    }),

  notFound: (message = 'Resource not found', additionalProps = {}) =>
    new ApplicationError(message, 'NOT_FOUND', {
      statusCode: 404,
      ...additionalProps
    }),

  validationError: (message = 'Invalid input.', additionalProps = {}) =>
    new ApplicationError(message, 'VALIDATION_ERROR', {
      statusCode: 400,
      ...additionalProps
    }),

  tokenExpired: (message = 'Your token has expired.', additionalProps = {}) =>
    new ApplicationError(message, 'TOKEN_EXPIRED', {
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

export const serializeError = error => ({
  message: error.message,
  statusCode: error.statusCode,
  type: error.errorType,
  additional: error.additional
});

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
      res.status(handledError.statusCode).json(serializeError(handledError));
    }
  };
};

export const wrap = () => promise => {
  return async function wrapped(...args) {
    try {
      return await promise(...args);
    } catch (err) {
      return handle(error);
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

export const wrapDecorator = () => (key, target, descriptor) => {
  const promise = descriptor.value;
  descriptor.value = function decorated(...args) {
    return wrap(error)(promise.bind(this))(...args);
  };
  return descriptor;
};

export default errors;
