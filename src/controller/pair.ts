import { Request, Response } from 'express'
import { omit, uniq } from 'lodash'
import { ParsedQs } from 'qs'
import { Op } from 'sequelize'
import Source from '../database/models/source.model'
import sequelize from '../database/sequelize'
import getPairProvider from '../provider'
import { PairSchema } from '../schema'
import { PairService, SourceService, TokenService } from '../service'
import { log, makeResponse, paginate } from '../utils'

export async function getAllPairsHandler(
  req: Request<
    Record<string, unknown>,
    unknown,
    Record<string, unknown>,
    PairSchema.GetAllPairsRequestType['query'] & ParsedQs
  >,
  res: Response,
) {
  try {
    const { pageNum, pageSize, source } = req.query
    const { pairs, count, totalCount } = await PairService.getAllPairs({
      ...paginate(pageNum, pageSize),
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: source
        ? [
            {
              model: Source,
              where: { [Op.or]: { address: source, name: source } },
              attributes: [],
            },
          ]
        : undefined,
    })

    return makeResponse(res, true, 'All pairs fetched successfully', 200, {
      pairs,
      count,
      totalCount,
      pageNum,
      pageSize,
      hasNext: (pageNum + 1) * pageSize < totalCount,
    })
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}

export async function addPairsHandler(
  req: Request<
    Record<string, unknown>,
    unknown,
    PairSchema.AddPairsRequestType['body']
  >,
  res: Response,
) {
  try {
    const pairs = await sequelize.transaction(async transaction => {
      const pairAddresses = req.body.map(attribute => attribute.address)
      const sourceAddresses = uniq(req.body.map(attribute => attribute.factory))

      const [pairs, sources] = await Promise.all([
        PairService.getAllPairs({
          where: { address: { [Op.in]: pairAddresses } },
          transaction,
        }),
        SourceService.getAllSources({
          where: { address: { [Op.in]: sourceAddresses } },
          transaction,
        }),
      ])

      if (pairs.count !== 0 || sourceAddresses.length !== sources.count) return

      return await Promise.all(
        req.body.map(async ({ address, factory }) => {
          const provider = getPairProvider(
            sources.sources.find(source => source.address === factory)!.address,
          )

          const instance = new provider(address)
          const [token0Address, token1Address] = await instance.getTokens()

          const [{ token: token0 }, { token: token1 }] = await Promise.all([
            TokenService.findOrCreateToken(token0Address, transaction),
            TokenService.findOrCreateToken(token1Address, transaction),
          ])

          const pair = await PairService.addPair(
            { address, factory },
            transaction,
          )
          await pair.$add('tokens', [token0, token1], { transaction })

          return omit(pair.toJSON(), ['createdAt', 'updatedAt'])
        }),
      )
    })

    if (!pairs) return makeResponse(res, false, 'Pairs not added', 400)
    else return makeResponse(res, true, 'Pairs added successfully', 201, pairs)
  } catch (error: any) {
    log.error(error)
    return makeResponse(res, false, 'Internal Server Error', 500)
  }
}
