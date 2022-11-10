import { Attributes, FindAndCountOptions } from 'sequelize/types'
import Source, { CreateAttributes } from '../database/models/source.model'
import { log } from '../utils'

export async function getAllSources(
  query?: Omit<FindAndCountOptions<Attributes<Source>>, 'group'>,
) {
  try {
    const [{ rows, count }, totalCount] = await Promise.all([
      Source.findAndCountAll(query),
      Source.count(),
    ])

    return { sources: rows, count, totalCount }
  } catch (error: any) {
    log.error('Something went wrong while getting all sources')
    throw new Error(error)
  }
}

export function getSource(address: string) {
  try {
    return Source.findByPk(address)
  } catch (error: any) {
    log.error('Something went wrong while getting a source')
    throw new Error(error)
  }
}

export function addSource(attributes: CreateAttributes) {
  try {
    return Source.create(attributes)
  } catch (error: any) {
    log.error('Something went wrong while creating a source')
    throw new Error(error)
  }
}
