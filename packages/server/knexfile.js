const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
});

module.exports = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8'
  },
  debug: false,
  migrations: {
    directory: './tools/migrations'
  },
  seeds: {
    directory: './tools/seeds'
  }
};
