import config from 'config'
import { log } from '../utils'
import sequelize from '../database/sequelize'

export async function initializeDatabase() {
  const databaseHost = config.get<string>('PG_HOST')
  const databaseName = config.get<string>('PG_DATABASE')

  try {
    log.info(`Connecting to database at ${databaseHost}-${databaseName}`)
    await sequelize.authenticate()
    log.info('Database Connection has been established successfully')

    log.info('Syncing the database...')
    await sequelize.sync()
    log.info('Syncing completed successfully')
  } catch (e: any) {
    log.error(e)
    process.exit(1)
  }
}
