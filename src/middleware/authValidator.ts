import { Request, Response, NextFunction } from 'express'
import { get } from 'lodash'
import { makeResponse } from '../utils'

const API_KEY = process.env.API_KEY as string

const authValidator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.header('Authorization') || !req.header('authorization'))
    return makeResponse(
      res,
      false,
      'Authorization must be present in headers',
      401,
    )

  const apiKey = get(req, 'headers.authorization', '').replace(/^Basic\s/, '')

  if (!apiKey || apiKey !== Buffer.from(API_KEY).toString('base64'))
    return makeResponse(res, false, 'Invalid authorization', 401)

  return next()
}

export default authValidator
