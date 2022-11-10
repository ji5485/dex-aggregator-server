import NodeCache from 'node-cache'
import config from 'config'

type Key = string | number

class InternalCache {
  private static _instance: InternalCache
  private cache: NodeCache

  private constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.5,
      useClones: false,
    })
  }

  public static getInstance(): InternalCache {
    if (!InternalCache._instance) {
      InternalCache._instance = new InternalCache(
        config.get<number>('CACHE_DEFAULT_TTL'),
      )
    }
    return InternalCache._instance
  }

  public get<T>(key: Key): T | undefined {
    return this.cache.get<T>(key)
  }

  public set<T>(key: Key, value: T): void {
    this.cache.set(key, value)
  }
}

export default InternalCache.getInstance()
