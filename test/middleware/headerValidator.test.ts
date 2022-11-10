import supertest from 'supertest'
import { initializeServer } from '../../src/loader'

const app = initializeServer()

const CORRECT_CONTENT_TYPE_HEADER = 'application/json'
const WRONG_CONTENT_TYPE_HEADER = 'wrong header'
const WRONG_RESPONSE_MESSAGE = 'Content-Type must be application/json'

describe('Header Validate Middleware', () => {
  describe('Request with GET Method', () => {
    it('Include Content-Type Header', () =>
      supertest(app)
        .get('/ping')
        .set({ 'Content-Type': CORRECT_CONTENT_TYPE_HEADER })
        .expect(200))

    it('Not Include Content-Type Header', () =>
      supertest(app).get('/ping').expect(200))

    it('Include Wrong Content-Type Header', () =>
      supertest(app)
        .get('/ping')
        .set({ 'Content-Type': WRONG_CONTENT_TYPE_HEADER })
        .expect(200))
  })

  describe('Request with POST Method', () => {
    it('Include Content-Type Header', () =>
      supertest(app)
        .post('/ping')
        .set({ 'Content-Type': CORRECT_CONTENT_TYPE_HEADER })
        .expect(200))

    it('Not Include Content-Type Header', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app).post('/ping').expect(400)

      expect(success).toBeFalsy()
      expect(message).toBe(WRONG_RESPONSE_MESSAGE)
      expect(code).toBe(400)
    })

    it('Include Wrong Content-Type Header', async () => {
      const {
        body: { success, message, code },
      } = await supertest(app)
        .post('/ping')
        .set({ 'Content-Type': WRONG_CONTENT_TYPE_HEADER })
        .expect(400)

      expect(success).toBeFalsy()
      expect(message).toBe(WRONG_RESPONSE_MESSAGE)
      expect(code).toBe(400)
    })
  })
})
