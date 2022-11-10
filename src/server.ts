import 'dotenv/config'
import config from 'config'
import {
  initializeServer,
  initializeDatabase,
  initializeScheduler,
  initializeRedis,
} from './loader'
import { log } from './utils'

const app = initializeServer()

const env = config.get<string>('ENVIRONMENT')
const isProd = env === 'production'

const protocol = isProd ? 'https' : 'http'
const host = isProd ? 'api.plexus.com' : 'localhost'
const port = config.get<number>('SERVER_PORT')
const url = isProd ? `${protocol}://${host}` : `${protocol}://${host}:${port}`

const initialize = async () => {
  try {
    app.listen(port, async () => {
      log.info(`Environment - ${env}`)

      await initializeDatabase()
      await initializeRedis()
      initializeScheduler()

      log.info(`Routing Engine Server ${env} server is running at ${url}`)
    })
  } catch (e) {
    log.error(e)
  }
}

initialize()
