import { Attributes, FindAndCountOptions } from 'sequelize/types'
import { allTokens } from './tokenMockData'
import Token from '../../../../src/database/models/token.model'

export function getAllTokensMockService(
  query?: Omit<FindAndCountOptions<Attributes<Token>>, 'group'>,
) {
  if (!query?.offset || !query?.limit)
    return Promise.resolve({
      rows: allTokens,
      count: allTokens.length,
    })

  const result = allTokens.slice(
    query?.offset,
    (query?.offset as number) + (query?.limit as number),
  )
  return Promise.resolve({ rows: result, count: allTokens.length })
}

export function findOrCreateTokenMockService(create: boolean) {
  return function (address: string) {
    return Promise.resolve({
      token: new Token({
        address,
        symbol: 'TEST',
        name: 'Test Token',
        decimal: 18,
      }),
      create,
    })
  }
}
