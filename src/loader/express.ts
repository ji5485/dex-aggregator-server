import express, { Request, Response } from 'express'
import Helmet from 'helmet'
import Cors from 'cors'
import morgan from 'morgan'
import { routesV1 } from '../routes'
import { headerValidator, throttle } from '../middleware'

const CORS_OPTIONS = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

export function initializeServer() {
  const app = express()

  app.use(Cors(CORS_OPTIONS))
  app.use(Helmet())
  app.use(express.json())
  app.use(morgan('common'))

  app.use(headerValidator)
  app.use(throttle)

  app.all('/ping', (_req: Request, res: Response) => res.sendStatus(200))
  routesV1(app)

  return app
}
