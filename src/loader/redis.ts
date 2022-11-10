import { log, redis } from '../utils'

export async function initializeRedis() {
  try {
    log.info(`Connecting to redis`)
    await redis.connect()
    log.info('Redis Connection has been established successfully')
  } catch (error: any) {
    log.error(error)
    process.exit(1)
  }
}
