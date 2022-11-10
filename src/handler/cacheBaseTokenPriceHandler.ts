import { ethers, utils } from 'ethers'
import JSBI from 'jsbi'
import BigNumber from 'bignumber.js'
import {
  BASE_TOKENS,
  CONTRACT_ADDRESS,
  convertChecksumAddress,
  httpProvider,
  log,
  MULTICALL_ABI,
  ORACLE_ABI,
} from '../utils'
import cache from '../utils/common/cache'

export type BaseTokenPriceCacheType = {
  blockNumber: number
  price: { address: string; price: number }[]
}

BigNumber.config({ DECIMAL_PLACES: 8 })

const multicall = new ethers.Contract(
  CONTRACT_ADDRESS.multicall,
  MULTICALL_ABI,
  httpProvider,
)

const tokens = Object.values(BASE_TOKENS)
const callData = tokens.map(token => ({
  to: '0x07d91f5fb9bf7798734c3f606db065549f6893bb',
  data: new utils.Interface(ORACLE_ABI).encodeFunctionData('getRateToEth', [
    token.address,
    true,
  ]),
}))

export default async function cacheBaseTokenPriceHandler(blockNumber: number) {
  try {
    const before = Date.now()
    const [prices, success] = await multicall.functions.multicall(callData)

    if (!success.every((res: boolean) => res))
      throw new Error('Price does not calculated')

    const pricesForETH = prices.map((encoded: string, index: number) => {
      const numerator = JSBI.multiply(
        JSBI.BigInt(encoded),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(tokens[index].decimals)),
      )
      const denominator = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
      const quotient = JSBI.divide(numerator, denominator).toString()

      return {
        address: tokens[index].address,
        price: new BigNumber(1)
          .div(new BigNumber(quotient).dividedBy(new BigNumber(10).pow(18)))
          .toNumber(),
      }
    })

    const usdcPrice = pricesForETH.find(
      ({ address }: { address: string; price: number }) =>
        address === BASE_TOKENS.USDC.address,
    )
    const pricesForUSDC = pricesForETH.map(
      ({ address, price }: { address: string; price: number }) => ({
        address: convertChecksumAddress(address),
        price: price / usdcPrice.price,
      }),
    )

    cache.set<BaseTokenPriceCacheType>('baseTokenPrice', {
      blockNumber,
      price: pricesForUSDC,
    })

    const time = (Date.now() - before) / 1000

    log.info(`Price of base tokens is calculated: ${blockNumber} / ${time}s`)
  } catch (error: any) {
    log.error(error)
  }
}
