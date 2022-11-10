import { initializeServer } from '../src/loader'

const API_KEY = process.env.API_KEY as string

export default function initTest() {
  const app = initializeServer()
  const HTTP_HEADER = {
    Authorization: `Basic ${Buffer.from(API_KEY).toString('base64')}`,
  }

  return { app, HTTP_HEADER }
}
