import supertest from 'supertest'
import initTest from '../../../initTest'
import Source from '../../../../src/database/models/source.model'
import { SourceService } from '../../../../src/service'
import { addSourceMockService } from './sourceMockService'
import { addSourceAttributes } from './sourceMockData'

const { app, HTTP_HEADER } = initTest()

describe('Source', () => {
  describe('Success with Valid Attributes', () => {
    afterEach(jest.clearAllMocks)

    const mockAddSourceService = jest
      .spyOn(SourceService, 'addSource')
      .mockImplementation(addSourceMockService)
    const mockGetAllSourcesService = jest
      .spyOn(SourceService, 'getAllSources')
      .mockReturnValue(
        Promise.resolve({ sources: [], count: 0, totalCount: 10 }),
      )

    it('Add Uniswap V2 Source', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/v1/source')
        .set(HTTP_HEADER)
        .send(addSourceAttributes.uniswapV2)
        .expect(201)

      expect(success).toEqual(true)
      expect(message).toEqual('Source added successfully')
      expect(code).toEqual(201)

      expect(mockGetAllSourcesService).toBeCalled()
      expect(mockAddSourceService).toBeCalledWith(addSourceAttributes.uniswapV2)
    })

    it('Add Sushiswap Source', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/v1/source')
        .set(HTTP_HEADER)
        .send(addSourceAttributes.sushiswap)
        .expect(201)

      expect(success).toEqual(true)
      expect(message).toEqual('Source added successfully')
      expect(code).toEqual(201)

      expect(mockGetAllSourcesService).toBeCalled()
      expect(mockAddSourceService).toBeCalledWith(addSourceAttributes.sushiswap)
    })
  })

  describe('Failure with Invalid Attributes', () => {
    afterEach(jest.clearAllMocks)

    it('Failure with duplicated source name', async () => {
      const mockGetAllSourcesService = jest
        .spyOn(SourceService, 'getAllSources')
        .mockReturnValue(
          Promise.resolve({
            sources: [new Source(addSourceAttributes.uniswapV2)],
            count: 1,
            totalCount: 10,
          }),
        )

      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/v1/source')
        .set(HTTP_HEADER)
        .send(addSourceAttributes.uniswapV2)
        .expect(400)

      expect(success).toEqual(false)
      expect(message).toEqual('Source is already exist')
      expect(code).toEqual(400)

      expect(mockGetAllSourcesService).toBeCalled()
    })
  })
})
