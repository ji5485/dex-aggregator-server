import BasePairProvider from './basePairProvider'
import { convertChecksumAddress } from '../utils'

export default class UniswapPairProvider extends BasePairProvider {
  constructor(address: string) {
    super(address)
  }

  get token0(): Promise<string> {
    return this.contract.functions
      .token0()
      .then(result => convertChecksumAddress(result[0]))
  }

  get token1(): Promise<string> {
    return this.contract.functions
      .token1()
      .then(result => convertChecksumAddress(result[0]))
  }

  public async getTokens(): Promise<[string, string]> {
    const [token0, token1] = await Promise.all([this.token0, this.token1])
    return token0 < token1 ? [token0, token1] : [token1, token0]
  }

  public getReserves(): Promise<[string, string]> {
    return this.contract.functions.getReserves()
  }
}
