import Pair from '../database/models/pair.model'
import Source from '../database/models/source.model'
import Token from '../database/models/token.model'
import { PairService } from '../service'
import { BASE_TOKENS_ADDRESS, redis, CACHE_KEY, log } from '../utils'

export default async function cacheAllPairsHandler() {
  try {
    const beforeAllPairsCache = Date.now()

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

    const baseContainedPairs: Pair[] = []

    for (let index = 0; index < pairs.length; index++) {
      const { tokens } = pairs[index]

      if (
        BASE_TOKENS_ADDRESS.includes(tokens[0].address) &&
        BASE_TOKENS_ADDRESS.includes(tokens[1].address)
      )
        baseContainedPairs.push(pairs[index])
    }

    redis.set(CACHE_KEY.allPairs, JSON.stringify(pairs), {
      EX: 24 * 60 * 60,
    })
    redis.set(
      CACHE_KEY.baseContainedPairs,
      JSON.stringify(baseContainedPairs),
      { EX: 24 * 60 * 60 },
    )

    const time = (Date.now() - beforeAllPairsCache) / 1000

    log.info(
      `All pairs (${pairs.length}) / Base contained pairs (${baseContainedPairs.length}) cached successfully / ${time}s`,
    )
  } catch (error: any) {
    log.error(error)
  }
}
