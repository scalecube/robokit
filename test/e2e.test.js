/**
 * E2E tests — requires the server to be running first:
 *   npm run robokit
 *
 * All config is read from .env-local automatically.
 * Set GITHUB_INSTALLATION_ID in .env-local for GitHub API calls (check run creation) to succeed.
 *
 * Run:
 *   npm run test:e2e
 */

const crypto = require('crypto')
const axios = require('axios')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../.env-local') })

const SECRET = process.env.WEBHOOK_SECRET
const PORT = process.env.PORT || '7777'
const WEBHOOK_PATH = process.env.WEBHOOKS_PATH || '/api/github/webhooks'
const BASE_URL = `http://localhost:${PORT}`

const OWNER = process.env.GITHUB_OWNER || 'scalecube'
const REPO = process.env.GITHUB_REPO || 'robokit'
const SHA = process.env.GITHUB_SHA || '0000000000000000000000000000000000000000'
const INSTALLATION_ID = parseInt(process.env.GITHUB_INSTALLATION_ID || '0')

function sign (body) {
  return 'sha256=' + crypto.createHmac('sha256', SECRET).update(body, 'utf8').digest('hex')
}

async function sendWebhook (event, payload) {
  const body = JSON.stringify(payload)
  return axios.post(BASE_URL + WEBHOOK_PATH, body, {
    headers: {
      'X-GitHub-Event': event,
      'X-GitHub-Delivery': crypto.randomUUID(),
      'X-Hub-Signature-256': sign(body),
      'Content-Type': 'application/json'
    },
    validateStatus: () => true
  })
}

function checkRunPayload (overrides = {}) {
  return {
    action: 'completed',
    installation: {
      id: INSTALLATION_ID,
      node_id: `install-${INSTALLATION_ID}`
    },
    sender: {
      login: 'e2e-test',
      avatar_url: 'https://github.com/ghost.png'
    },
    repository: {
      name: REPO,
      owner: { login: OWNER }
    },
    check_run: {
      id: Date.now(),
      name: 'robokit-deploy',
      head_sha: SHA,
      status: 'completed',
      conclusion: 'success',
      external_id: '',
      pull_requests: [],
      check_suite: {
        head_branch: 'develop',
        pull_requests: []
      },
      ...overrides.check_run
    },
    ...overrides
  }
}

describe('Robokit e2e', () => {
  test('server is reachable', async () => {
    const res = await axios.get(BASE_URL, { validateStatus: () => true })
    expect(res.status).not.toBe(0)
  })

  test('rejects webhook with invalid signature', async () => {
    const body = JSON.stringify(checkRunPayload())
    const res = await axios.post(BASE_URL + WEBHOOK_PATH, body, {
      headers: {
        'X-GitHub-Event': 'check_run',
        'X-GitHub-Delivery': crypto.randomUUID(),
        'X-Hub-Signature-256': 'sha256=badsignature',
        'Content-Type': 'application/json'
      },
      validateStatus: () => true
    })
    expect(res.status).toBe(400)
  })

  test('check_run robokit-deploy on develop triggers deploy', async () => {
    const res = await sendWebhook('check_run', checkRunPayload())
    expect([200, 202]).toContain(res.status)
  })

  test('check_run with non-trigger name does not deploy', async () => {
    const res = await sendWebhook('check_run', checkRunPayload({
      check_run: { name: 'some-other-ci-job' }
    }))
    // still accepted by the server, just ignored internally
    expect([200, 202]).toContain(res.status)
  })
}, 15000)
