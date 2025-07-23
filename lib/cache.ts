interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  size(): number {
    return this.cache.size
  }
}

export const cache = new MemoryCache()

// Cache keys
export const CACHE_KEYS = {
  USERS: "users",
  USER_BY_EMAIL: (email: string) => `user:${email}`,
  AGENDA_BY_USER: (userId: number) => `agenda:${userId}`,
  TASKS_BY_USER: (userId: number) => `tasks:${userId}`,
  DOCUMENTS_BY_USER: (userId: number) => `documents:${userId}`,
  TRANSACTIONS_BY_USER: (userId: number) => `transactions:${userId}`,
  PROJECTS_BY_USER: (userId: number) => `projects:${userId}`,
} as const
