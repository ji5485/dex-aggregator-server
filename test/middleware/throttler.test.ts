import supertest from 'supertest'
import { initializeServer } from '../../src/loader'
import { throttle } from '../../src/middleware'

const app = initializeServer()
app.use(throttle)

describe('Throttling Middleware', () => {
  it('Can Send Requests More Than 50 in 30 Seconds', async () => {
    await Promise.all(
      Array.from({ length: 50 }).map(async () => await supertest(app).get('/ping').expect(200)),
    )
  })

  it('Can Not Send Requests More Than 50 in 30 Seconds', async () => {
    const {
      body: { success, message, code },
    } = await supertest(app).get('/ping').expect(429)

    expect(success).toBeFalsy()
    expect(message).toBe('Too many requests')
    expect(code).toBe(429)
  })
})
