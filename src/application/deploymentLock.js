const logger = require('../logger')

const active = new Map()

function withLock (key, fn) {
  if (active.has(key)) {
    logger.warn({ key }, 'deploy.skipped.already-in-progress')
    return Promise.resolve({ skipped: true })
  }
  const promise = fn().finally(() => active.delete(key))
  active.set(key, promise)
  return promise
}

function isLocked (key) {
  return active.has(key)
}

module.exports = { withLock, isLocked }
