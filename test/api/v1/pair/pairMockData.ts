import Pair from '../../../../src/database/models/pair.model'
import { convertChecksumAddress } from '../../../../src/utils'
import { addresses } from '../constant'
import { addSourceAttributes } from '../source/sourceMockData'

const factory = Object.values(addSourceAttributes)

export const addPairsAttributes = addresses
  .slice(0, 7)
  .map((address, index) => ({
    address: convertChecksumAddress(address),
    factory: factory[index % 2].address,
  }))

export const allPairs = addresses.map(
  address =>
    new Pair({
      address,
      factory: factory[Math.round(Math.random())].address,
    }),
)
