import { Request, Response } from 'express'
import { ParsedQs } from 'qs'
import {
  Token as TokenInstance,
  TokenGraph,
  Hop,
  Pair as PairInstance,
  getRoutesWithPercent,
  getBestSwapRoute,
} from '@hi-protocol/router-sdk'
import Source from '../database/models/source.model'
import Token from '../database/models/token.model'
import { TokenSchema } from '../schema'
import { PairService, TokenService } from '../service'
import {
  log,
  makeResponse,
  paginate,
  makeTokenSearchQuery,
  getBlockNumber,
  cache,
  CACHE_KEY,
  redis,
  convertPairInstance,
  setTokenAmountsWithAllRoutes,
} from '../utils'
import { cachePairInstancesHandler } from '../handler'

export async function getAllTokensHandler(
  req: Request<
    Record<string, unknown>,
    unknown,
    Record<string, unknown>,
    TokenSchema.GetAllTokensRequestType['query'] & ParsedQs
  >,
  res: Response,
) {
  try {
    const { pageNum, pageSize, search } = req.query

    const query = {
      where: makeTokenSearchQuery(search),
      ...(pageNum && pageSize ? paginate(pageNum, pageSize) : {}),
    }

    const { tokens, count } = await TokenService.getAllTokens(query)

    return makeResponse(res, true, 'All tokens fetched successfully', 200, {
      tokens,
      count: tokens.length,
      totalCount: count,
      pageNum,
      pageSize,
      hasNext:
        pageNum && pageSize ? (pageNum + 1) * pageSize < count : undefined,
    })
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}

export async function addTokenHandler(
  req: Request<
    Record<string, unknown>,
    unknown,
    TokenSchema.AddTokenRequestType['body']
  >,
  res: Response,
) {
  try {
    const { token, create } = await TokenService.findOrCreateToken(
      req.body.address,
    )

    if (!create)
      return makeResponse(res, false, 'Token already exist', 400, token)
    else
      return makeResponse(res, true, 'Token created successfully', 201, token)
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}

export async function getTokenSwapDataHandler(
  req: Request<
    TokenSchema.GetTokenSwapDataRequestType['params'],
    unknown,
    Record<string, unknown>,
    TokenSchema.GetTokenSwapDataRequestType['query'] & ParsedQs
  >,
  res: Response,
) {
  try {
    const {
      params: { tradeType },
      query: { fromAddress, toAddress, wallet, amount, slippage },
    } = req

    const [from, to] = await Promise.all([
      TokenService.getToken(fromAddress),
      TokenService.getToken(toAddress),
    ])

    if (!from || !to)
      return makeResponse(res, false, 'Token does not exist', 400)

    const [fromToken, toToken] = [
      new TokenInstance(from.address, from.decimal),
      new TokenInstance(to.address, to.decimal),
    ]

    // TODO: 페어 조회 캐시 처리 (Redis / Node Cache)
    const cachedAllPairs = await redis.get(CACHE_KEY.allPairs)
    const { pairs } =
      cachedAllPairs === null
        ? await PairService.getAllPairs({
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
        : { pairs: JSON.parse(cachedAllPairs) }

    const filteredPairs = PairService.filterPairs(pairs, fromAddress, toAddress)
    const pairList = convertPairInstance(filteredPairs)

    log.info(`Pairs filtered successfully / count: ${pairList.length}`)

    // Redis에 저장된 캐시 데이터의 블록 넘버와 현재 블록 넘버가 일치하는지 확인하기 위해 사용
    const blockNumber = await getBlockNumber()

    const cachedBaseContainedPairs = cache.get<{
      pairs: PairInstance[]
      blockNumber: number
    }>(CACHE_KEY.convertedBaseContainedPairs)

    const baseContainedPairs =
      cachedBaseContainedPairs?.blockNumber === blockNumber
        ? cachedBaseContainedPairs.pairs
        : await cachePairInstancesHandler(blockNumber).then(
            result => result.pairs,
          )

    let before = Date.now()
    const graph = new TokenGraph(
      Hop.convertHopsFromPairs([...pairList, ...baseContainedPairs]),
    )
    console.log(`Generate Graph : ${(Date.now() - before) / 1000}s`)
    before = Date.now()

    const allRoutes = graph.computeAllPaths(fromToken, toToken, 3, 10)

    console.log(`Compute All Routes : ${(Date.now() - before) / 1000}s`)
    before = Date.now()

    await setTokenAmountsWithAllRoutes(allRoutes)

    console.log(`Setting All Routes : ${(Date.now() - before) / 1000}s`)
    before = Date.now()

    const routesByPercent = getRoutesWithPercent(
      allRoutes,
      amount,
      10,
      tradeType,
    )

    console.log(`Split Routes With Percent : ${(Date.now() - before) / 1000}s`)
    before = Date.now()

    const bestRoute = getBestSwapRoute(routesByPercent, tradeType)

    console.log(`Calculate Best Swap Route : ${(Date.now() - before) / 1000}s`)

    return makeResponse(
      res,
      true,
      'Swap data generated successfully',
      200,
      bestRoute,
    )
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}
