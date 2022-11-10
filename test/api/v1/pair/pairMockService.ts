import { Attributes, FindAndCountOptions } from 'sequelize/types'
import Pair, {
  CreateAttributes,
} from '../../../../src/database/models/pair.model'
import { allPairs } from './pairMockData'

export function getAllPairsMockService(
  query?: Omit<FindAndCountOptions<Attributes<Pair>>, 'group'>,
) {
  const result = allPairs.slice(
    query?.offset,
    (query?.offset as number) + (query?.limit as number),
  )

  return Promise.resolve({
    pairs: result,
    count: result.length,
    totalCount: allPairs.length,
  })
}

export function addPairsMockService(attribute: CreateAttributes) {
  return Promise.resolve(new Pair(attribute))
}
