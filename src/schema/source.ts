import { object, number, string, preprocess, TypeOf } from 'zod'
import config from 'config'
import { isAddress, convertChecksumAddress } from '../utils'

export const getAllSourcesSchema = object({
  query: object({
    pageNum: preprocess(
      value => parseInt(value as string),
      number().nonnegative({ message: 'PageNum must be nonnegative' }),
    ).default(0),
    pageSize: preprocess(
      value => parseInt(value as string),
      number().nonnegative({ message: 'PageSize must be nonnegative' }),
    ).default(config.get<number>('PAGE_SIZE')),
  }),
})

export const addSourceSchema = object({
  body: object({
    address: string({ required_error: 'Factory address is required' })
      .refine(isAddress, {
        message: 'Invalid Address Format',
      })
      .transform(convertChecksumAddress),
    name: string({ required_error: 'Name is required' }),
  }),
})

export type GetAllSourcesRequestType = TypeOf<typeof getAllSourcesSchema>
export type AddSourceRequestType = TypeOf<typeof addSourceSchema>
