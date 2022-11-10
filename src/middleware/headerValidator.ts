import { Request, Response, NextFunction } from 'express'
import { makeResponse } from '../utils'

const headerValidator = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === 'POST' &&
    (!req.header('Content-Type') ||
      req.header('Content-Type') !== 'application/json')
  )
    return makeResponse(
      res,
      false,
      'Content-Type must be application/json',
      400,
    )

  return next()
}

export default headerValidator
