const { Subject } = require('rxjs')
const logger = require('../../logger')

function deploy (context) {
  logger.info({ owner: context.owner, repo: context.repo, branch: context.branch }, 'cd-service.mock.deploy')
  const subject = new Subject()
  const id = `mock-${context.sha}`
  const ts = () => new Date().toISOString()
  const event = (status, message) => ({ sig: 0, d: { status, id, timestamp: ts(), data: { message } } })

  setTimeout(() => subject.next(event('RUNNING', 'Preparing deployment (mock)')), 200)
  setTimeout(() => subject.next(event('RUNNING', 'Deploying (mock)...')), 1200)
  setTimeout(() => {
    subject.next(event('SUCCEEDED', 'Deployment complete (mock)'))
    subject.complete()
  }, 2500)

  return subject.asObservable()
}

function isConnected () { return true }

module.exports = { deploy, isConnected }
