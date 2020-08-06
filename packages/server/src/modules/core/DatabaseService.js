import { Model } from 'objection';
import Knex from 'knex';
import mysql from 'mysql';
import { promisify } from 'util';

import { isProd } from '@c4/shared';

import config from '@root/config';
import logger, { withLog } from '@root/logger';


export class DatabaseService {
  @withLog()
  static async initialize() {
    if (!isProd) {
      // await DatabaseService.createDatabase();
    }
    const knex = Knex(config.DB);
    Model.knex(knex);
  }

  @withLog()
  static async createDatabase() {
    const connection = mysql.createConnection({
      host: config.DB.connection.host,
      user: config.DB.connection.user,
      password: config.DB.connection.password
    });
    const connect = promisify(connection.connect).bind(connection);
    const query = promisify(connection.query).bind(connection);
    const end = promisify(connection.end).bind(connection);

    logger.info('=========================================');
    logger.info('CREATING DATABASE');
    logger.info('=========================================');
    logger.info('Established MySQLConnexion...');
    await connect();
    logger.info('Connected to MySQL.');
    logger.info(`Creating Database ${config.DB.connection.database}...`);
    await query(`DROP DATABASE IF EXISTS ${config.DB.connection.database}`);
    await query(
      `CREATE DATABASE IF NOT EXISTS ${config.DB.connection.database}`
    );
    logger.info('Database created. Making migrations...');
    const knex = Knex(config.DB);
    await knex.migrate.latest();
    logger.info('Migrations successful');
    logger.info('Seeding database...');
    await knex.seed.run();
    await end();
    knex.destroy();
    logger.info('Seeding successful. Database ready');
  }
}
