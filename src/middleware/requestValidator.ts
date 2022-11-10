import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'
import { makeResponse } from '../utils'

const requestValidator =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      req.body = result.body
      req.query = result.query
      req.params = result.params

      return next()
    } catch (e: any) {
      console.log(e)
      return makeResponse(res, false, e.errors[0].message, 400)
    }
  }

export default requestValidator
