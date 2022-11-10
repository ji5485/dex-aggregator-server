import supertest from 'supertest'
import { TokenService } from '../../../../src/service'
import initTest from '../../../initTest'
import { allTokens } from './tokenMockData'
import { getAllTokensMockService } from './tokenMockService'

const { app, HTTP_HEADER } = initTest()

describe('Token', () => {
  afterEach(jest.clearAllMocks)

  const mockGetAllTokensService = jest
    .spyOn(TokenService, 'getAllTokens')
    .mockImplementation(getAllTokensMockService)

  it('Get all tokens without any queries', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app).get('/v1/token').set(HTTP_HEADER).expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All tokens fetched successfully')
    expect(code).toEqual(200)

    expect(data.tokens).toStrictEqual(allTokens.map(token => token.toJSON()))
    expect(data.count).toEqual(102)
    expect(data.totalCount).toEqual(allTokens.length)
    expect(data.pageNum).toEqual(undefined)
    expect(data.pageSize).toEqual(undefined)
    expect(data.hasNext).toEqual(undefined)

    expect(mockGetAllTokensService).toBeCalledWith({ where: {} })
  })

  it('Get all tokens with pageNum: 0 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/token')
      .query({ pageNum: 0 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All tokens fetched successfully')
    expect(code).toEqual(200)

    expect(data.tokens).toStrictEqual(allTokens.map(token => token.toJSON()))
    expect(data.count).toEqual(102)
    expect(data.totalCount).toEqual(allTokens.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(undefined)
    expect(data.hasNext).toEqual(undefined)

    expect(mockGetAllTokensService).toBeCalledWith({ where: {} })
  })

  it('Get all tokens with pageSize: 10 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/token')
      .query({ pageSize: 10 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All tokens fetched successfully')
    expect(code).toEqual(200)

    expect(data.tokens).toStrictEqual(allTokens.map(token => token.toJSON()))
    expect(data.count).toEqual(102)
    expect(data.totalCount).toEqual(allTokens.length)
    expect(data.pageNum).toEqual(undefined)
    expect(data.pageSize).toEqual(10)
    expect(data.hasNext).toEqual(undefined)

    expect(mockGetAllTokensService).toBeCalledWith({ where: {} })
  })

  it('Get all tokens with pageNum: 2 and pageSize: 15 query', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/token')
      .query({ pageNum: 2, pageSize: 15 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All tokens fetched successfully')
    expect(code).toEqual(200)

    expect(data.tokens).toStrictEqual(
      allTokens.slice(30, 45).map(token => token.toJSON()),
    )
    expect(data.count).toEqual(15)
    expect(data.totalCount).toEqual(allTokens.length)
    expect(data.pageNum).toEqual(2)
    expect(data.pageSize).toEqual(15)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllTokensService).toBeCalledWith({
      where: {},
      offset: 30,
      limit: 15,
    })
  })
})
