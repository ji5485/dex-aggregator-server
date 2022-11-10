import Source from '../../../../src/database/models/source.model'
import { addresses } from '../constant'

export const addSourceAttributes = {
  uniswapV2: {
    address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    name: 'Uniswap V2',
  },
  sushiswap: {
    address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    name: 'Sushiswap',
  },
}

export const allSources = addresses.map(
  (address, index) => new Source({ name: `Source${index + 1}`, address }),
)
