import logger from 'pino'
import pino from 'pino-pretty'
import dayjs from 'dayjs'

const pretifier = pino({
  colorize: true,
  ignore: 'pid,hostname',
  customPrettifiers: {
    time: (timestamp: any) =>
      `[${dayjs(timestamp).format('YYYY/MM/DD HH:mm:ss')}]`,
  },
})

export const log = logger(pretifier)
