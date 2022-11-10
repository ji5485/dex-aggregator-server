import { Router } from 'express'
import { SourceController } from '../../controller'
import { authValidator, requestValidator } from '../../middleware'
import { SourceSchema } from '../../schema'

const router = Router()

router.get(
  '/',
  authValidator,
  requestValidator(SourceSchema.getAllSourcesSchema),
  SourceController.getAllSources,
)

router.post(
  '/',
  authValidator,
  requestValidator(SourceSchema.addSourceSchema),
  SourceController.addSourceHandler,
)

export default router
