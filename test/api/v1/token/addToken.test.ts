import supertest from 'supertest'
import initTest from '../../../initTest'
import { TokenService } from '../../../../src/service'
import { findOrCreateTokenMockService } from './tokenMockService'
import { allTokens } from './tokenMockData'
import { convertChecksumAddress } from '../../../../src/utils'

const { app, HTTP_HEADER } = initTest()

describe('Token', () => {
  afterEach(jest.clearAllMocks)

  it('Token added successfully with valid address', async () => {
    const mockFindOrCreateTokenService = jest
      .spyOn(TokenService, 'findOrCreateToken')
      .mockImplementation(findOrCreateTokenMockService(true))

    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .post('/v1/token')
      .set(HTTP_HEADER)
      .send({ address: allTokens[0].address })
      .expect(201)

    expect(success).toEqual(true)
    expect(message).toEqual('Token created successfully')
    expect(code).toEqual(201)

    expect(data.address).toEqual(convertChecksumAddress(allTokens[0].address))
    expect(data.symbol).toEqual('TEST')
    expect(data.name).toEqual('Test Token')
    expect(data.decimal).toEqual(18)

    expect(mockFindOrCreateTokenService).toBeCalledWith(
      convertChecksumAddress(allTokens[0].address),
    )
  })

  it('Token does not added with invalid address', async () => {
    const mockFindOrCreateTokenService = jest
      .spyOn(TokenService, 'findOrCreateToken')
      .mockImplementation(findOrCreateTokenMockService(false))

    const {
      body: { success, message, code },
    } = await supertest(app)
      .post('/v1/token')
      .set(HTTP_HEADER)
      .send({ address: 'address' })
      .expect(400)

    expect(success).toEqual(false)
    expect(message).toEqual('Invalid Address Format')
    expect(code).toEqual(400)

    expect(mockFindOrCreateTokenService).not.toBeCalled()
  })

  it('Token does not added with duplicated token address', async () => {
    const mockFindOrCreateTokenService = jest
      .spyOn(TokenService, 'findOrCreateToken')
      .mockImplementation(findOrCreateTokenMockService(false))

    const {
      body: { success, message, code, data },
    } = await supertest(app)
      .post('/v1/token')
      .set(HTTP_HEADER)
      .send({ address: allTokens[0].address })
      .expect(400)

    expect(success).toEqual(false)
    expect(message).toEqual('Token already exist')
    expect(code).toEqual(400)

    expect(data.address).toEqual(convertChecksumAddress(allTokens[0].address))
    expect(data.symbol).toEqual('TEST')
    expect(data.name).toEqual('Test Token')
    expect(data.decimal).toEqual(18)

    expect(mockFindOrCreateTokenService).toBeCalledWith(
      convertChecksumAddress(allTokens[0].address),
    )
  })
})
