// DeploymentPolicy depends on config which reads process.env at load time
process.env.APP_ID = 'test'
process.env.PRIVATE_KEY = 'test'
process.env.WEBHOOK_SECRET = 'test'

const policy = require('../../../src/domain/DeploymentPolicy')

const CI_TRIGGER = {
  name: 'robokit-deploy',
  status: 'completed',
  conclusion: 'success',
  branch: 'develop',
  release: false
}

describe('DeploymentPolicy.evaluate', () => {
  describe('own check run', () => {
    test('Robokit CD events are always ignored', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, name: 'Robokit CD' })
      expect(result.deploy).toBe(false)
      expect(result.reason).toBe('own-check-run')
    })
  })

  describe('CI trigger (robokit-deploy)', () => {
    test('completed/success on develop → deploy', () => {
      const result = policy.evaluate(CI_TRIGGER)
      expect(result.deploy).toBe(true)
      expect(result.reason).toMatch(/^ci:/)
    })

    test('completed/success on master → deploy', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, branch: 'master' })
      expect(result.deploy).toBe(true)
    })

    test('completed/success on feature branch → skip', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, branch: 'feature/my-thing' })
      expect(result.deploy).toBe(false)
      expect(result.reason).toMatch(/branch-not-deployable/)
    })

    test('not completed → skip', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, status: 'in_progress', conclusion: null })
      expect(result.deploy).toBe(false)
    })

    test('completed but failed → skip', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, conclusion: 'failure' })
      expect(result.deploy).toBe(false)
    })

    test('release flag bypasses branch check', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, branch: 'feature/my-thing', release: true })
      expect(result.deploy).toBe(true)
    })
  })

  describe('release trigger', () => {
    const RELEASE_TRIGGER = {
      name: 'Robokit CD (release)',
      status: 'completed',
      conclusion: 'success',
      branch: 'main',
      tagName: '1.2.3'
    }

    test('Robokit CD (release) completed/success → deploy', () => {
      const result = policy.evaluate(RELEASE_TRIGGER)
      expect(result.deploy).toBe(true)
      expect(result.reason).toMatch(/^release:/)
    })

    test('Robokit CD (release) not completed → skip', () => {
      const result = policy.evaluate({ ...RELEASE_TRIGGER, status: 'in_progress', conclusion: null })
      expect(result.deploy).toBe(false)
    })
  })

  describe('unrelated check runs', () => {
    test('any other job name → skip', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, name: 'jest' })
      expect(result.deploy).toBe(false)
      expect(result.reason).toMatch(/not-a-trigger/)
    })

    test('robokit-deploy on unknown conclusion → skip', () => {
      const result = policy.evaluate({ ...CI_TRIGGER, conclusion: 'cancelled' })
      expect(result.deploy).toBe(false)
    })
  })
})

describe('DeploymentPolicy.evaluateUserAction', () => {
  test('deploy_now → deploy: true', () => {
    const r = policy.evaluateUserAction('deploy_now')
    expect(r.deploy).toBe(true)
    expect(r.cancel).toBe(false)
  })

  test('cancel_deploy_now → cancel: true', () => {
    const r = policy.evaluateUserAction('cancel_deploy_now')
    expect(r.deploy).toBe(false)
    expect(r.cancel).toBe(true)
  })

  test('null / unknown → no-op', () => {
    expect(policy.evaluateUserAction(null)).toEqual({ deploy: false, cancel: false })
    expect(policy.evaluateUserAction('unknown')).toEqual({ deploy: false, cancel: false })
    expect(policy.evaluateUserAction(undefined)).toEqual({ deploy: false, cancel: false })
  })
})
