import { Response } from 'express'
import { Op } from 'sequelize'
import { uniqBy } from 'lodash'
import {
  TokenAmount,
  Token,
  Pair as PairInstance,
  Route,
  Hop,
} from '@hi-protocol/router-sdk'
import Pair from '../../database/models/pair.model'
import getPairProvider from '../../provider'

export const makeResponse = (
  response: Response,
  result: boolean,
  message: string,
  code: number,
  data: any = {},
) =>
  response.status(code).json({
    success: result,
    message: message,
    code: code,
    data: data,
  })

export const paginate = (page: number, pageSize: number) => ({
  offset: page * pageSize,
  limit: pageSize,
})

export const makeTokenSearchQuery = (search?: string) =>
  search
    ? {
        [Op.or]: {
          address: {
            [Op.iLike]: `%${search}%`,
          },
          symbol: {
            [Op.iLike]: `%${search}%`,
          },
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
      }
    : {}

export const convertPairInstance = (pairs: Pair[]) => {
  const tokensInPairs = []
  const tokenAmounts: { [address: string]: TokenAmount } = {}

  for (let index = 0; index < pairs.length; index++) {
    const { tokens } = pairs[index]

    tokensInPairs.push({
      address: tokens[0].address,
      decimal: tokens[0].decimal,
    })
    tokensInPairs.push({
      address: tokens[1].address,
      decimal: tokens[1].decimal,
    })
  }

  const tokens = uniqBy(tokensInPairs, token => token.address)

  for (let index = 0; index < tokens.length; index++) {
    const { address, decimal } = tokens[index]
    tokenAmounts[address] = new TokenAmount(new Token(address, decimal), 0)
  }

  const pairList = []

  for (let index = 0; index < pairs.length; index++) {
    const { address, tokens, source } = pairs[index]

    if (!tokenAmounts[tokens[0].address] || !tokenAmounts[tokens[1].address])
      continue

    pairList.push(
      new PairInstance(
        address,
        tokenAmounts[tokens[0].address],
        tokenAmounts[tokens[1].address],
        0.3,
        source.address,
      ),
    )
  }

  return pairList
}

export const setTokenAmountsWithAllRoutes = async (routes: Route[]) => {
  try {
    const setTokenAmountsInHop = async (hop: Hop) => {
      for (let pIndex = 0; pIndex < hop.pair.length; pIndex++) {
        const pair = hop.pair[pIndex]

        const provider = new (getPairProvider(pair.protocol))(pair.address)

        const [reserves, tokens] = await Promise.all([
          provider.getReserves(),
          provider.getTokens(),
        ])

        if (pair.token0.address === tokens[0])
          pair.setTokenAmounts(
            new TokenAmount(pair.token0, reserves[0]),
            new TokenAmount(pair.token1, reserves[1]),
          )
        else
          pair.setTokenAmounts(
            new TokenAmount(pair.token0, reserves[1]),
            new TokenAmount(pair.token1, reserves[0]),
          )
      }
    }

    await Promise.all(
      routes.map(async route =>
        Promise.all(route.hops.map(hop => setTokenAmountsInHop(hop))),
      ),
    )
  } catch (error: any) {
    throw new Error(error)
  }
}
