import { uniqBy } from 'lodash'
import { Attributes, FindAndCountOptions, Transaction } from 'sequelize/types'
import Pair, { CreateAttributes } from '../database/models/pair.model'
import { BASE_TOKENS_ADDRESS, log } from '../utils'

export async function getAllPairs(
  query?: Omit<FindAndCountOptions<Attributes<Pair>>, 'group'>,
) {
  try {
    const [{ rows, count }, totalCount] = await Promise.all([
      Pair.findAndCountAll(query),
      Pair.count(),
    ])

    return { pairs: rows, count, totalCount }
  } catch (error: any) {
    log.error('Something went wrong while getting all pairs')
    throw new Error(error)
  }
}

export function addPair(
  attribute: CreateAttributes,
  transaction?: Transaction,
) {
  try {
    return Pair.create(attribute, { transaction })
  } catch (error: any) {
    log.error('Something went wrong while creating pairs')
    throw new Error(error)
  }
}

export function filterPairs(pairs: Pair[], from: string, to: string) {
  const fromIsBaseToken = BASE_TOKENS_ADDRESS.includes(from)
  const toIsBaseToken = BASE_TOKENS_ADDRESS.includes(to)

  // From과 To가 모두 Base Token인 경우
  if (fromIsBaseToken && toIsBaseToken) return []

  let result: Pair[] = []

  // From이 Base Token이 아닌 경우
  if (!fromIsBaseToken) {
    const baseContained = []
    const baseNotContained = []

    // 첫 번째 Hop 서치
    for (let index = 0; index < pairs.length; index++) {
      const { tokens } = pairs[index]

      if (tokens[0].address === from) {
        if (BASE_TOKENS_ADDRESS.includes(tokens[1].address))
          baseContained.push(pairs[index])
        else baseNotContained.push(pairs[index])
      } else if (tokens[1].address === from) {
        if (BASE_TOKENS_ADDRESS.includes(tokens[0].address))
          baseContained.push(pairs[index])
        else baseNotContained.push(pairs[index])
      }
    }

    const baseNotContainedSecond = []

    // 두 번째 Hop 서치
    for (let index = 0; index < baseNotContained.length; index++) {
      const { tokens } = baseNotContained[index]

      if (
        (tokens[0].address !== from &&
          BASE_TOKENS_ADDRESS.includes(tokens[1].address)) ||
        (tokens[1].address !== from &&
          BASE_TOKENS_ADDRESS.includes(tokens[0].address))
      )
        baseNotContainedSecond.push(baseNotContained[index])
    }

    result = [
      ...result,
      ...baseContained,
      ...baseNotContained,
      ...baseNotContainedSecond,
    ]
  }

  // To가 Base Token이 아닌 경우
  if (!toIsBaseToken) {
    const baseContained = []
    const baseNotContained = []

    // 첫 번째 Hop 서치
    for (let index = 0; index < pairs.length; index++) {
      const { tokens } = pairs[index]

      if (tokens[0].address === to) {
        if (BASE_TOKENS_ADDRESS.includes(tokens[1].address))
          baseContained.push(pairs[index])
        else baseNotContained.push(pairs[index])
      } else if (tokens[1].address === to) {
        if (BASE_TOKENS_ADDRESS.includes(tokens[0].address))
          baseContained.push(pairs[index])
        else baseNotContained.push(pairs[index])
      }
    }

    const baseNotContainedSecond = []

    // 두 번째 Hop 서치
    for (let index = 0; index < baseNotContained.length; index++) {
      const { tokens } = baseNotContained[index]

      if (
        (tokens[0].address !== to &&
          BASE_TOKENS_ADDRESS.includes(tokens[1].address)) ||
        (tokens[1].address !== to &&
          BASE_TOKENS_ADDRESS.includes(tokens[0].address))
      )
        baseNotContainedSecond.push(baseNotContained[index])
    }

    result = [
      ...result,
      ...baseContained,
      ...baseNotContained,
      ...baseNotContainedSecond,
    ]
  }

  return uniqBy(result, pair => pair.address)
}
