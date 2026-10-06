const { DeploymentContext } = require('../../../src/domain/DeploymentContext')

const BASE = {
  owner: 'acme', repo: 'my-service', sha: 'abc123',
  branch: 'develop', namespace: 'develop',
  checkRunName: 'robokit-deploy', status: 'completed', conclusion: 'success',
  user: 'alice', avatar: 'https://github.com/alice.png',
  installationNodeId: 'install-node-1', eventId: 'event-1'
}

describe('DeploymentContext', () => {
  test('sets all provided fields', () => {
    const ctx = new DeploymentContext(BASE)
    expect(ctx.owner).toBe('acme')
    expect(ctx.repo).toBe('my-service')
    expect(ctx.sha).toBe('abc123')
    expect(ctx.branch).toBe('develop')
    expect(ctx.checkRunName).toBe('robokit-deploy')
  })

  test('defaults optional release fields to false/null', () => {
    const ctx = new DeploymentContext(BASE)
    expect(ctx.release).toBe(false)
    expect(ctx.prerelease).toBe(false)
    expect(ctx.tagName).toBeNull()
    expect(ctx.releaseId).toBeNull()
    expect(ctx.draft).toBe(false)
  })

  test('is frozen — Object.isFrozen returns true', () => {
    const ctx = new DeploymentContext(BASE)
    expect(Object.isFrozen(ctx)).toBe(true)
  })

  test('withCheckRunName returns a new context with updated name', () => {
    const ctx = new DeploymentContext(BASE)
    const next = ctx.withCheckRunName('Robokit CD')
    expect(next.checkRunName).toBe('Robokit CD')
    expect(ctx.checkRunName).toBe('robokit-deploy')
    expect(next).not.toBe(ctx)
  })

  test('withNamespace returns a new context with updated namespace', () => {
    const ctx = new DeploymentContext(BASE)
    const next = ctx.withNamespace('feature-foo')
    expect(next.namespace).toBe('feature-foo')
    expect(ctx.namespace).toBe('develop')
    expect(next).not.toBe(ctx)
  })

  test('chaining with* preserves unrelated fields', () => {
    const ctx = new DeploymentContext(BASE)
    const next = ctx.withCheckRunName('Robokit CD').withNamespace('master')
    expect(next.owner).toBe('acme')
    expect(next.repo).toBe('my-service')
    expect(next.sha).toBe('abc123')
  })
})
