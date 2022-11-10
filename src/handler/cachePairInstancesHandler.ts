import retry from 'async-retry'
import { Pair as PairInstance, TokenAmount } from '@hi-protocol/router-sdk'
import Pair from '../database/models/pair.model'
import Source from '../database/models/source.model'
import Token from '../database/models/token.model'
import { PairService } from '../service'
import {
  BASE_TOKENS_ADDRESS,
  log,
  redis,
  cache,
  CACHE_KEY,
  BASE_TOKENS_INSTANCE,
} from '../utils'
import getPairProvider from '../provider'

async function getAllBaseContainedPairs() {
  try {
    const cachedPairs = await redis.get(CACHE_KEY.baseContainedPairs)

    if (cachedPairs) return JSON.parse(cachedPairs)

    const { pairs } = await PairService.getAllPairs({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Token,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { attributes: [] },
        },
        {
          model: Source,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
    })

    const baseContainedPairs = []

    for (let index = 0; index < pairs.length; index++) {
      const { tokens } = pairs[index]

      if (
        BASE_TOKENS_ADDRESS.includes(tokens[0].address) &&
        BASE_TOKENS_ADDRESS.includes(tokens[1].address)
      )
        baseContainedPairs.push(pairs[index])
    }

    return baseContainedPairs
  } catch (error: any) {
    throw new Error(error)
  }
}

async function createPairInstance(pair: Pair) {
  const provider = new (getPairProvider(pair.source.address))(pair.address)

  const [reserves, tokens] = await Promise.all([
    provider.getReserves(),
    provider.getTokens(),
  ])

  return new PairInstance(
    pair.address,
    new TokenAmount(BASE_TOKENS_INSTANCE[tokens[0]], reserves[0]),
    new TokenAmount(BASE_TOKENS_INSTANCE[tokens[1]], reserves[1]),
    0.3,
    pair.source.address,
  )
}

export default function cacheBaseContainedPairsHandler(blockNumber: number) {
  return retry(
    async () => {
      const beforeCachePairs = Date.now()

      const baseContainedPairs = await getAllBaseContainedPairs()
      const pairs = []

      for (let index = 0; index < baseContainedPairs.length; index++)
        pairs[index] = createPairInstance(baseContainedPairs[index])

      const result = await Promise.all(pairs)

      log.info(
        `Pairs contained base tokens are cached: ${blockNumber} / ${
          (Date.now() - beforeCachePairs) / 1000
        }s`,
      )

      cache.set(CACHE_KEY.convertedBaseContainedPairs, {
        pairs: result,
        blockNumber,
      })

      return {
        pairs: result,
        blockNumber,
      }
    },
    {
      retries: 3,
    },
  )
}
