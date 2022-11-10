import { object, number, string, preprocess, TypeOf, array } from 'zod'
import config from 'config'
import { isAddress, convertChecksumAddress } from '../utils'

export const getAllPairsSchema = object({
  query: object({
    pageNum: preprocess(
      value => parseInt(value as string),
      number().nonnegative({ message: 'PageNum must be nonnegative' }),
    ).default(0),
    pageSize: preprocess(
      value => parseInt(value as string),
      number().nonnegative({ message: 'PageSize must be nonnegative' }),
    ).default(config.get<number>('PAGE_SIZE')),
    source: string()
      .optional()
      .transform(str => {
        if (str && isAddress(str)) return convertChecksumAddress(str)
        else return str
      }),
  }),
})

export const addPairsSchema = object({
  body: array(
    object({
      address: string({ required_error: 'Pair address is required' })
        .refine(isAddress, { message: 'Invalid Address Format' })
        .transform(convertChecksumAddress),
      factory: string({ required_error: 'Factory address is required' })
        .refine(isAddress, { message: 'Invalid Address Format' })
        .transform(convertChecksumAddress),
    }),
  ).min(1),
})

export type GetAllPairsRequestType = TypeOf<typeof getAllPairsSchema>
export type AddPairsRequestType = TypeOf<typeof addPairsSchema>
