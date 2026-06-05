process.env.APP_ID = 'test'
process.env.PRIVATE_KEY = 'test'
process.env.WEBHOOK_SECRET = 'test'

// Fresh module per test to reset the active map
let lock

beforeEach(() => {
  jest.resetModules()
  lock = require('../../../src/application/deploymentLock')
})

describe('deploymentLock', () => {
  test('runs the function and resolves its return value', async () => {
    const result = await lock.withLock('repo:branch', () => Promise.resolve('done'))
    expect(result).toBe('done')
  })

  test('second call for same key while first is running returns {skipped: true}', async () => {
    let resolve
    const first = lock.withLock('repo:branch', () => new Promise(r => { resolve = r }))
    const second = lock.withLock('repo:branch', () => Promise.resolve('second'))

    const secondResult = await second
    expect(secondResult).toEqual({ skipped: true })

    resolve('first')
    expect(await first).toBe('first')
  })

  test('lock is released after completion — second call then succeeds', async () => {
    await lock.withLock('repo:branch', () => Promise.resolve())
    const result = await lock.withLock('repo:branch', () => Promise.resolve('second run'))
    expect(result).toBe('second run')
  })

  test('lock is released even if the function throws', async () => {
    await lock.withLock('repo:branch', () => Promise.reject(new Error('boom'))).catch(() => {})
    const result = await lock.withLock('repo:branch', () => Promise.resolve('after error'))
    expect(result).toBe('after error')
  })

  test('different keys run concurrently without blocking each other', async () => {
    const results = await Promise.all([
      lock.withLock('repo:develop', () => Promise.resolve('develop')),
      lock.withLock('repo:master', () => Promise.resolve('master'))
    ])
    expect(results).toEqual(['develop', 'master'])
  })

  test('isLocked reflects active state', async () => {
    expect(lock.isLocked('repo:branch')).toBe(false)
    let resolve
    const p = lock.withLock('repo:branch', () => new Promise(r => { resolve = r }))
    expect(lock.isLocked('repo:branch')).toBe(true)
    resolve()
    await p
    expect(lock.isLocked('repo:branch')).toBe(false)
  })
})
