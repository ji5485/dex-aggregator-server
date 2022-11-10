import { Attributes, FindAndCountOptions } from 'sequelize/types'
import Source, {
  CreateAttributes,
} from '../../../../src/database/models/source.model'
import { allSources } from './sourceMockData'

export function getAllSourcesMockService(
  query?: Omit<FindAndCountOptions<Attributes<Source>>, 'group'>,
) {
  const result = allSources.slice(
    query?.offset,
    (query?.offset as number) + (query?.limit as number),
  )

  return Promise.resolve({
    sources: result,
    count: result.length,
    totalCount: allSources.length,
  })
}

export function addSourceMockService(attributes: CreateAttributes) {
  return Promise.resolve(new Source(attributes))
}
