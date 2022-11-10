import supertest from 'supertest'
import Pair from '../../../../src/database/models/pair.model'
import { PairService } from '../../../../src/service'
import initTest from '../../../initTest'
import { allPairs } from './pairMockData'
import { getAllPairsMockService } from './pairMockService'

const { app, HTTP_HEADER } = initTest()

describe('Pair', () => {
  afterEach(jest.clearAllMocks)

  const mockGetAllPairsService = jest
    .spyOn(PairService, 'getAllPairs')
    .mockImplementation(getAllPairsMockService)

  it('Get all pairs without any queries', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app).get('/v1/pair').set(HTTP_HEADER).expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All pairs fetched successfully')
    expect(code).toEqual(200)

    expect(data.pairs).toStrictEqual(
      allPairs.slice(0, 100).map((pair: Pair) => pair.toJSON()),
    )
    expect(data.count).toEqual(100)
    expect(data.totalCount).toEqual(allPairs.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(100)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllPairsService).toBeCalledWith(
      expect.objectContaining({ offset: 0, limit: 100 }),
    )
  })

  it('Get all pairs with pageNum: 0 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/pair')
      .query({ paegNum: 0 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All pairs fetched successfully')
    expect(code).toEqual(200)

    expect(data.pairs).toStrictEqual(
      allPairs.slice(0, 100).map((pair: Pair) => pair.toJSON()),
    )
    expect(data.count).toEqual(100)
    expect(data.totalCount).toEqual(allPairs.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(100)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllPairsService).toBeCalledWith(
      expect.objectContaining({ offset: 0, limit: 100 }),
    )
  })

  it('Get all pairs with pageNum: 1 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/pair')
      .query({ pageNum: 1 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All pairs fetched successfully')
    expect(code).toEqual(200)

    expect(data.pairs).toStrictEqual(
      allPairs.slice(100).map((pair: Pair) => pair.toJSON()),
    )
    expect(data.count).toEqual(2)
    expect(data.totalCount).toEqual(allPairs.length)
    expect(data.pageNum).toEqual(1)
    expect(data.pageSize).toEqual(100)
    expect(data.hasNext).toEqual(false)

    expect(mockGetAllPairsService).toBeCalledWith(
      expect.objectContaining({ offset: 100, limit: 100 }),
    )
  })

  it('Get all pairs with pageSize: 10 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/pair')
      .query({ pageSize: 10 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All pairs fetched successfully')
    expect(code).toEqual(200)

    expect(data.pairs).toStrictEqual(
      allPairs.slice(0, 10).map((pair: Pair) => pair.toJSON()),
    )
    expect(data.count).toEqual(10)
    expect(data.totalCount).toEqual(allPairs.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(10)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllPairsService).toBeCalledWith(
      expect.objectContaining({ offset: 0, limit: 10 }),
    )
  })

  it('Get all pairs with pageNum: 2 and pageSize: 15 query', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/pair')
      .query({ pageNum: 2, pageSize: 15 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All pairs fetched successfully')
    expect(code).toEqual(200)

    expect(data.pairs).toStrictEqual(
      allPairs.slice(30, 45).map((pair: Pair) => pair.toJSON()),
    )
    expect(data.count).toEqual(15)
    expect(data.totalCount).toEqual(allPairs.length)
    expect(data.pageNum).toEqual(2)
    expect(data.pageSize).toEqual(15)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllPairsService).toBeCalledWith(
      expect.objectContaining({ offset: 30, limit: 15 }),
    )
  })
})
