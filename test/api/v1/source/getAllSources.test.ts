import supertest from 'supertest'
import { pick } from 'lodash'
import initTest from '../../../initTest'
import Source from '../../../../src/database/models/source.model'
import { SourceService } from '../../../../src/service'
import { allSources } from './sourceMockData'
import { getAllSourcesMockService } from './sourceMockService'

const { app, HTTP_HEADER } = initTest()

describe('Source', () => {
  afterEach(jest.clearAllMocks)

  const mockGetAllSourcesService = jest
    .spyOn(SourceService, 'getAllSources')
    .mockImplementation(getAllSourcesMockService)

  it('Get all sources without any queries', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app).get('/v1/source').set(HTTP_HEADER).expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All sources fetched successfully')
    expect(code).toEqual(200)

    expect(
      data.sources.map((source: Source) => pick(source, ['address', 'name'])),
    ).toStrictEqual(
      allSources
        .slice(0, 100)
        .map((source: Source) => pick(source, ['address', 'name'])),
    )
    expect(data.count).toEqual(100)
    expect(data.totalCount).toEqual(allSources.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(100)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllSourcesService).toBeCalledWith({ offset: 0, limit: 100 })
  })

  it('Get all sources with pageNum: 0 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/source')
      .query({ pageNum: 0 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All sources fetched successfully')
    expect(code).toEqual(200)

    expect(
      data.sources.map((source: Source) => pick(source, ['address', 'name'])),
    ).toStrictEqual(
      allSources
        .slice(0, 100)
        .map((source: Source) => pick(source, ['address', 'name'])),
    )
    expect(data.count).toEqual(100)
    expect(data.totalCount).toEqual(allSources.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(100)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllSourcesService).toBeCalledWith({ offset: 0, limit: 100 })
  })

  it('Get all sources with pageNum: 1 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/source')
      .query({ pageNum: 1 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All sources fetched successfully')
    expect(code).toEqual(200)

    expect(
      data.sources.map((source: Source) => pick(source, ['address', 'name'])),
    ).toStrictEqual(
      allSources
        .slice(100)
        .map((source: Source) => pick(source, ['address', 'name'])),
    )
    expect(data.count).toEqual(2)
    expect(data.totalCount).toEqual(allSources.length)
    expect(data.pageNum).toEqual(1)
    expect(data.pageSize).toEqual(100)
    expect(data.hasNext).toEqual(false)

    expect(mockGetAllSourcesService).toBeCalledWith({ offset: 100, limit: 100 })
  })

  it('Get all sources with pageSize: 10 query only', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/source')
      .query({ pageSize: 10 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All sources fetched successfully')
    expect(code).toEqual(200)

    expect(
      data.sources.map((source: Source) => pick(source, ['address', 'name'])),
    ).toStrictEqual(
      allSources
        .slice(0, 10)
        .map((source: Source) => pick(source, ['address', 'name'])),
    )
    expect(data.count).toEqual(10)
    expect(data.totalCount).toEqual(allSources.length)
    expect(data.pageNum).toEqual(0)
    expect(data.pageSize).toEqual(10)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllSourcesService).toBeCalledWith({ offset: 0, limit: 10 })
  })

  it('Get all sources with pageNum: 2 and pageSize: 15 query', async () => {
    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .get('/v1/source')
      .query({ pageNum: 2, pageSize: 15 })
      .set(HTTP_HEADER)
      .expect(200)

    expect(success).toEqual(true)
    expect(message).toEqual('All sources fetched successfully')
    expect(code).toEqual(200)

    expect(
      data.sources.map((source: Source) => pick(source, ['address', 'name'])),
    ).toStrictEqual(
      allSources
        .slice(30, 45)
        .map((source: Source) => pick(source, ['address', 'name'])),
    )
    expect(data.count).toEqual(15)
    expect(data.totalCount).toEqual(allSources.length)
    expect(data.pageNum).toEqual(2)
    expect(data.pageSize).toEqual(15)
    expect(data.hasNext).toEqual(true)

    expect(mockGetAllSourcesService).toBeCalledWith({ offset: 30, limit: 15 })
  })
})
