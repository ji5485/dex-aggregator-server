import { Attributes, FindAndCountOptions, Transaction } from 'sequelize/types'
import Token from '../database/models/token.model'
import { getTokenInfo, log } from '../utils'

export async function getAllTokens(
  query?: Omit<FindAndCountOptions<Attributes<Token>>, 'group'>,
) {
  try {
    const [{ rows, count }, totalCount] = await Promise.all([
      Token.findAndCountAll({
        ...query,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }),
      Token.count(),
    ])

    return { tokens: rows, count, totalCount }
  } catch (error: any) {
    log.error('Something went wrong while getting all tokens')
    throw new Error(error)
  }
}

export function getToken(address: string, transaction?: Transaction) {
  try {
    return Token.findByPk(address, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      transaction,
    })
  } catch (error: any) {
    log.error('Something went wrong while getting token')
    throw new Error(error)
  }
}

export async function findOrCreateToken(
  address: string,
  transaction?: Transaction,
) {
  try {
    const token = await getToken(address, transaction)

    if (token) return { token, create: false }
    else {
      const tokenInfo = await getTokenInfo(address)
      const newToken = await Token.create(tokenInfo, { transaction })

      return { token: newToken, created: true }
    }
  } catch (error: any) {
    log.error('Something went wrong while finding or creating a token')
    throw new Error(error)
  }
}
