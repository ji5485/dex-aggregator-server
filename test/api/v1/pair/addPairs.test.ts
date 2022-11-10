import supertest from 'supertest'
import initTest from '../../../initTest'
import Source from '../../../../src/database/models/source.model'
import Pair from '../../../../src/database/models/pair.model'
import {
  PairService,
  SourceService,
  TokenService,
} from '../../../../src/service'
import UniswapPairProvider from '../../../../src/provider/uniswapPairProvider'
import { addPairsAttributes } from './pairMockData'
import { addPairsMockService } from './pairMockService'
import { addSourceAttributes } from '../source/sourceMockData'
import { findOrCreateTokenMockService } from '../token/tokenMockService'
import { addresses } from '../constant'

const { app, HTTP_HEADER } = initTest()

describe('Pair', () => {
  const mockFindOrCreateTokenService = jest
    .spyOn(TokenService, 'findOrCreateToken')
    .mockImplementation(findOrCreateTokenMockService(true))
  const mockAddPairService = jest
    .spyOn(PairService, 'addPair')
    .mockImplementation(addPairsMockService)
  const mockSetPairTokens = jest
    .spyOn(Pair.prototype, '$add')
    .mockReturnValue(Promise.resolve())
  const mockUniswapPairProvider = jest
    .spyOn(UniswapPairProvider.prototype, 'getTokens')
    .mockReturnValue(Promise.resolve([addresses[0], addresses[1]]))

  describe('Success with valid attributes', () => {
    afterEach(jest.clearAllMocks)

    const mockGetAllSourcesService = jest
      .spyOn(SourceService, 'getAllSources')
      .mockReturnValue(
        Promise.resolve({
          sources: Object.values(addSourceAttributes).map(
            attribute => new Source(attribute),
          ),
          count: 2,
          totalCount: 2,
        }),
      )
    const mockGetAllPairsService = jest
      .spyOn(PairService, 'getAllPairs')
      .mockReturnValue(Promise.resolve({ pairs: [], count: 0, totalCount: 10 }))

    it('Add One Pair of Uniswap V2', async () => {
      const {
        body: { success, message, code, data },
      } = await supertest(app)
        .post('/v1/pair')
        .set(HTTP_HEADER)
        .send(addPairsAttributes)
        .expect(201)

      expect(success).toEqual(true)
      expect(message).toEqual('Pairs added successfully')
      expect(code).toEqual(201)

      expect(data).toStrictEqual(addPairsAttributes)

      expect(mockGetAllSourcesService).toBeCalledTimes(1)
      expect(mockGetAllPairsService).toBeCalledTimes(1)
      expect(mockUniswapPairProvider).toBeCalledTimes(7)
      expect(mockFindOrCreateTokenService).toBeCalledTimes(14)
      expect(mockAddPairService).toBeCalledTimes(7)
      expect(mockSetPairTokens).toBeCalledTimes(7)
    })

    it('Add Pairs of Uniswap V2 and Sushiswap', async () => {
      const {
        body: { success, message, code, data },
      } = await supertest(app)
        .post('/v1/pair')
        .set(HTTP_HEADER)
        .send(addPairsAttributes)
        .expect(201)

      expect(success).toEqual(true)
      expect(message).toEqual('Pairs added successfully')
      expect(code).toEqual(201)

      expect(data).toStrictEqual(addPairsAttributes)

      expect(mockGetAllSourcesService).toBeCalledTimes(1)
      expect(mockGetAllPairsService).toBeCalledTimes(1)
      expect(mockUniswapPairProvider).toBeCalledTimes(7)
      expect(mockFindOrCreateTokenService).toBeCalledTimes(14)
      expect(mockAddPairService).toBeCalledTimes(7)
      expect(mockSetPairTokens).toBeCalledTimes(7)
    })
  })

  describe('Failure with any reasons', () => {
    afterEach(jest.clearAllMocks)

    it('Failure with source that does not exist in database', async () => {
      const mockGetAllSourcesService = jest
        .spyOn(SourceService, 'getAllSources')
        .mockReturnValue(
          Promise.resolve({
            sources: [new Source(addSourceAttributes.uniswapV2)],
            count: 1,
            totalCount: 1,
          }),
        )
      const mockGetAllPairsService = jest
        .spyOn(PairService, 'getAllPairs')
        .mockReturnValue(
          Promise.resolve({ pairs: [], count: 0, totalCount: 10 }),
        )

      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/v1/pair')
        .set(HTTP_HEADER)
        .send(addPairsAttributes)
        .expect(400)

      expect(success).toEqual(false)
      expect(message).toEqual('Pairs not added')
      expect(code).toEqual(400)

      expect(mockGetAllSourcesService).toBeCalledTimes(1)
      expect(mockGetAllPairsService).toBeCalledTimes(1)
      expect(mockUniswapPairProvider).not.toBeCalled()
      expect(mockFindOrCreateTokenService).not.toBeCalled()
      expect(mockAddPairService).not.toBeCalled()
      expect(mockSetPairTokens).not.toBeCalled()
    })

    it('Failure with pair that already exist in database', async () => {
      const mockGetAllSourcesService = jest
        .spyOn(SourceService, 'getAllSources')
        .mockReturnValue(
          Promise.resolve({
            sources: Object.values(addSourceAttributes).map(
              attribute => new Source(attribute),
            ),
            count: 2,
            totalCount: 2,
          }),
        )
      const mockGetAllPairsService = jest
        .spyOn(PairService, 'getAllPairs')
        .mockReturnValue(
          Promise.resolve({
            pairs: [new Pair(addPairsAttributes[0])],
            count: 1,
            totalCount: 10,
          }),
        )

      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/v1/pair')
        .set(HTTP_HEADER)
        .send(addPairsAttributes)
        .expect(400)

      expect(success).toEqual(false)
      expect(message).toEqual('Pairs not added')
      expect(code).toEqual(400)

      expect(mockGetAllSourcesService).toBeCalledTimes(1)
      expect(mockGetAllPairsService).toBeCalledTimes(1)
      expect(mockUniswapPairProvider).not.toBeCalled()
      expect(mockFindOrCreateTokenService).not.toBeCalled()
      expect(mockAddPairService).not.toBeCalled()
      expect(mockSetPairTokens).not.toBeCalled()
    })
  })
})
