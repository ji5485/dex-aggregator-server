import supertest from 'supertest'
import { Request, Response } from 'express'
import initTest from '../initTest'
import { authValidator } from '../../src/middleware'

const { app, HTTP_HEADER } = initTest()

app.all('/test', authValidator, (_req: Request, res: Response) =>
  res.sendStatus(200),
)

describe('Authorization Validate Middleware', () => {
  it('With Valid API KEY', () =>
    supertest(app).get('/test').set(HTTP_HEADER).expect(200))

  it('Without Authorization Header', async () => {
    const {
      body: { success, message, code },
    } = await supertest(app).get('/test').expect(401)

    expect(success).toEqual(false)
    expect(message).toEqual('Authorization must be present in headers')
    expect(code).toEqual(401)
  })

  it('With Invalid API KEY', async () => {
    const {
      body: { success, message, code },
    } = await supertest(app)
      .get('/test')
      .set({ Authorization: `Wrong API KEY` })
      .expect(401)

    expect(success).toEqual(false)
    expect(message).toEqual('Invalid authorization')
    expect(code).toEqual(401)
  })
})
