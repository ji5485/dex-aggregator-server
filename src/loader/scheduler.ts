import { scheduleJob } from 'node-schedule'
import {
  cacheBaseTokenPriceHandler,
  cachePairInstancesHandler,
  cacheAllPairsHandler,
} from '../handler'
import { log, websocketProvider } from '../utils'

export function initializeScheduler() {
  try {
    websocketProvider._addEventListener(
      'block',
      cacheBaseTokenPriceHandler,
      false,
    )
    websocketProvider._addEventListener(
      'block',
      cachePairInstancesHandler,
      false,
    )

    cacheAllPairsHandler()
    scheduleJob('0 0 12 * * ?', cacheAllPairsHandler)

    log.info('Event Handler connected successfully')
  } catch (error: any) {
    log.error(error)
    process.exit(1)
  }
}
