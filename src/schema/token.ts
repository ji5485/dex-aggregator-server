import { nativeEnum, number, object, preprocess, string, TypeOf } from 'zod'
import JSBI from 'jsbi'
import { TradeType } from '@hi-protocol/router-sdk'
import { isAddress, convertChecksumAddress } from '../utils'

export const getAllTokensSchema = object({
  query: object({
    pageNum: preprocess(
      value => parseInt(value as string),
      number().nonnegative({ message: 'PageNum must be nonnegative' }),
    ).optional(),
    pageSize: preprocess(
      value => parseInt(value as string),
      number().nonnegative({ message: 'PageSize must be nonnegative' }),
    ).optional(),
    search: string().optional(),
  }),
})

export const addTokenSchema = object({
  body: object({
    address: string({ required_error: 'address is required' })
      .refine(isAddress, {
        message: 'Invalid Address Format',
      })
      .transform(convertChecksumAddress),
  }),
})

export const getTokenSwapDataSchema = object({
  params: object({
    tradeType: nativeEnum(TradeType),
  }),
  query: object({
    fromAddress: string({ required_error: 'From token address is required' })
      .refine(isAddress, {
        message: 'Invalid Address Format',
      })
      .transform(convertChecksumAddress),
    toAddress: string({ required_error: 'To token address is required' })
      .refine(isAddress, {
        message: 'Invalid Address Format',
      })
      .transform(convertChecksumAddress),
    wallet: string({ required_error: 'Wallet address is required' })
      .refine(isAddress, {
        message: 'Invalid Address Format',
      })
      .transform(convertChecksumAddress),
    amount: string({ required_error: 'Amount is required' }).refine(value => {
      try {
        return JSBI.BigInt(value)
      } catch (_error: any) {
        return false
      }
    }),
    slippage: preprocess(
      value => parseFloat(value as string),
      number().nonnegative({ message: 'Slippage must be nonnegative' }),
    ),
  }),
})

export type GetAllTokensRequestType = TypeOf<typeof getAllTokensSchema>
export type AddTokenRequestType = TypeOf<typeof addTokenSchema>
export type GetTokenSwapDataRequestType = TypeOf<typeof getTokenSwapDataSchema>
