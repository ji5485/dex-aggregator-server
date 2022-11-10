import { Sequelize } from 'sequelize-typescript'
import config from 'config'

const sequelize = new Sequelize(
  config.get<string>('PG_DATABASE'),
  config.get<string>('PG_USERNAME'),
  config.get<string>('PG_PASSWORD'),
  {
    host: config.get<string>('PG_HOST'),
    dialect: 'postgres',
    port: config.get<number>('PG_PORT'),
    timezone: config.get<string>('PG_TIMEZONE'),
    models: [__dirname + '/models'],
    pool: {
      max: 50, // max 디비 커넥션
      min: 0, // min 디비 커넥션
      idle: 5000, // 1개의 커넥션이 5초동안 task가 주어지지 않을시 커넥션 회수 e.g. --connectionCount;
      acquire: 100000, // 커넥션이 다 바쁜상태일시 100초동안 대기후 그후에도 커넥션받지못할시 throw 에러
    },
  },
)

export default sequelize
