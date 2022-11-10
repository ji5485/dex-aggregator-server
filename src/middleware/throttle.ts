import RateLimit from 'express-rate-limit'
import { Request, Response } from 'express'
import { makeResponse } from '../utils'
import { get } from 'lodash'

const throttler = RateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 50,
  handler: (req: Request, res: Response) =>
    makeResponse(res, false, 'Too many requests', 429),
  keyGenerator: (req: Request) => {
    if (req.method === 'GET' || req.originalUrl.endsWith('/wallet/auth'))
      return req.ip
    else return get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')
  },
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
})

export default throttler
