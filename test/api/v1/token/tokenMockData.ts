import Token from '../../../../src/database/models/token.model'
import { addresses } from '../constant'

export const allTokens = addresses.map(
  (address, index) =>
    new Token({
      address,
      symbol: `TEST${index}`,
      name: `Test Token ${index}`,
      decimal: 18,
    }),
)
