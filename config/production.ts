import 'dotenv/config'

export default {
  SERVER_PORT: 5000,
  PG_DATABASE: process.env.PG_DATABASE,
  PG_USERNAME: process.env.PG_USERNAME,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_HOST: process.env.PG_HOST,
  PG_TIMEZONE: process.env.PG_TIMEZONE,
  PG_PORT: process.env.PG_PORT,
  PAIR_FILTER_LENGTH: process.env.PAIR_FILTER_LENGTH,
  PAGE_SIZE: process.env.PAGE_SIZE,
  MOMENT_TIME: process.env.MOMENT_TIME,
  MOMENT_UNIT: process.env.MOMENT_UNIT,
  CACHE_DEFAULT_TTL: process.env.INTERNAL_CACHE_DEFAULT_TTL,
  ENVIRONMENT: 'production',
  HTTP_NODE_PROVIDER_LINK: process.env.HTTP_NODE_PROVIDER_LINK,
  WEBSOCKET_NODE_PROVIDER_LINK: process.env.WEBSOCKET_NODE_PROVIDER_LINK,
}
