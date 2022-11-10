import { Router } from 'express'
import { PairController } from '../../controller'
import { authValidator, requestValidator } from '../../middleware'
import { PairSchema } from '../../schema'

const router = Router()

router.get(
  '/',
  authValidator,
  requestValidator(PairSchema.getAllPairsSchema),
  PairController.getAllPairsHandler,
)

router.post(
  '/',
  authValidator,
  requestValidator(PairSchema.addPairsSchema),
  PairController.addPairsHandler,
)

export default router
