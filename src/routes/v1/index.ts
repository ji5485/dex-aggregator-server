import { Express } from 'express'
import TokenRoutes from './token'
import PairRoutes from './pair'
import SourceRoutes from './source'

export default function routes(app: Express) {
  app.use('/v1/token', TokenRoutes)
  app.use('/v1/pair', PairRoutes)
  app.use('/v1/source', SourceRoutes)
}
