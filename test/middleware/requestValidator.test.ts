import supertest from 'supertest'
import { Request, Response } from 'express'
import { custom, object } from 'zod'
import { initializeServer } from '../../src/loader'
import { requestValidator } from '../../src/middleware'
import { isAddress } from '../../src/utils'

const app = initializeServer()
const TEST_ADDRESS = '0x0000000000000000000000000000000000000001'

describe('Request Validation Middleware', () => {
  describe('Request with Parameters', () => {
    const schema = object({
      params: object({
        address: custom((data: any) => isAddress(data), {
          message: 'Invalid Address Format',
        }),
      }),
    })
    app.get(
      '/test1/:address',
      requestValidator(schema),
      (_req: Request, res: Response) => res.sendStatus(200),
    )

    it('With Valid Address Parameter', () =>
      supertest(app).get(`/test1/${TEST_ADDRESS}`).expect(200))

    it('With Invalid Address Parameter', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app).get('/test1/abc').expect(400)

      expect(success).toBeFalsy()
      expect(message).toBe('Invalid Address Format')
      expect(code).toBe(400)
    })
  })

  describe('Request with Request Body', () => {
    const schema = object({
      body: object({
        address: custom((data: any) => isAddress(data), {
          message: 'Invalid Address Format',
        }),
      }),
    })
    app.post(
      '/test2',
      requestValidator(schema),
      (_req: Request, res: Response) => res.sendStatus(200),
    )

    it('With Valid Address Request Body', () =>
      supertest(app).post(`/test2`).send({ address: TEST_ADDRESS }).expect(200))

    it('With Invalid Address Request Body', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/test2')
        .send({ address: 'Address' })
        .expect(400)

      expect(success).toBeFalsy()
      expect(message).toBe('Invalid Address Format')
      expect(code).toBe(400)
    })
  })

  describe('Request with Query String', () => {
    const schema = object({
      query: object({
        address: custom((data: any) => isAddress(data), {
          message: 'Invalid Address Format',
        }),
      }),
    })
    app.get(
      '/test3',
      requestValidator(schema),
      (_req: Request, res: Response) => res.sendStatus(200),
    )

    it('With Valid Address Query String', () =>
      supertest(app).get(`/test3?address=${TEST_ADDRESS}`).expect(200))

    it('With Invalid Address Query String', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app).get('/test3?address=abc').expect(400)

      expect(success).toBeFalsy()
      expect(message).toBe('Invalid Address Format')
      expect(code).toBe(400)
    })
  })
})
