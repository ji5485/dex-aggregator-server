// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
    timezone: process.env.PG_TIMEZONE,
  },
  test: {
    username: process.env.TEST_PG_USER,
    password: process.env.TEST_PG_PASSWORD,
    database: process.env.TEST_PG_DATABASE,
    host: process.env.TEST_PG_HOST,
    port: process.env.TEST_PG_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
    timezone: process.env.TEST_PG_TIMEZONE,
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
    timezone: process.env.PG_TIMEZONE,
  },
}
