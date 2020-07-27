import dotenv from 'dotenv';
import dbConfig from '../knexfile'
import path from 'path';
import { isProd } from '@c4/shared';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

export default {
  PORT: process.env.PORT || 8888,

  ENV: process.env.NODE_ENV,

  WEBSITE_URL: 'http://localhost:3000',

  DB: dbConfig,

  LOGGER: {
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
  },

  SESSION: {
    SECRET: process.env.SESSION_SECRET
  },

  COOKIE: {
    PATH: '/',
    SECURE: isProd,
    SAMESITE: false,
    MAXAGE: 604800000,
    HTTPONLY: true
  },

  JWT: {
    SECRET: process.env.SESSION_SECRET,
    MAXAGE: 15 * 60, // 15min
    ISSUER: 'http://localhost:8000'
  },

  REFRESH_TOKEN: {
    SECRET: process.env.SESSION_SECRET,
    MAXAGE: 7 * 24 * 60 * 60, // 1 week
    ISSUER: 'http://localhost:8000'
  },
  RESET_PASSWORD: {
    EXPIRE: 1000 * 60 * 60 // 1 hour
  },

  MAILER: {
    ADDRESS: process.env.EMAIL_ADDRESS,
    PASSWORD: process.env.EMAIL_PASSWORD
  }
};
