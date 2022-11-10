import { Router } from 'express'
import { TokenController } from '../../controller'
import { authValidator, requestValidator } from '../../middleware'
import { TokenSchema } from '../../schema'

const router = Router()

router.get(
  '/',
  authValidator,
  requestValidator(TokenSchema.getAllTokensSchema),
  TokenController.getAllTokensHandler,
)

router.post(
  '/',
  authValidator,
  requestValidator(TokenSchema.addTokenSchema),
  TokenController.addTokenHandler,
)

router.get(
  '/:tradeType',
  authValidator,
  requestValidator(TokenSchema.getTokenSwapDataSchema),
  TokenController.getTokenSwapDataHandler,
)

export default router
