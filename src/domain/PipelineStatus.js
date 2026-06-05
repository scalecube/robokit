const ENV_TO_GITHUB = new Map([
  ['RUNNING',         { status: 'in_progress' }],
  ['SUCCEEDED',       { status: 'completed', conclusion: 'success' }],
  ['SUCCESS',         { status: 'completed', conclusion: 'success' }],
  ['TERMINAL',        { status: 'completed', conclusion: 'failure' }],
  ['FAILED_CONTINUE', { status: 'completed', conclusion: 'failure' }],
  ['ERROR',           { status: 'completed', conclusion: 'failure' }],
  ['CANCELLED',       { status: 'completed', conclusion: 'cancelled' }],
  ['PAUSED',          { status: 'completed', conclusion: 'cancelled' }],
  ['SUSPENDED',       { status: 'completed', conclusion: 'cancelled' }],
])

const MARKER = new Map([
  ['SUCCEEDED',       '>'],
  ['SUCCESS',         '>'],
  ['TERMINAL',        '<'],
  ['FAILED_CONTINUE', '<'],
  ['ERROR',           '<'],
  ['CANCELLED',       '#'],
  ['PAUSED',          '#'],
  ['SUSPENDED',       '#'],
  ['RUNNING',         '*'],
])

function toGitHub (envStatus) {
  return ENV_TO_GITHUB.get(envStatus) ?? { status: 'in_progress' }
}

function toMarker (envStatus) {
  return MARKER.get(envStatus) ?? ' '
}

function isTerminal (envStatus) {
  return toGitHub(envStatus).status === 'completed'
}

module.exports = { toGitHub, toMarker, isTerminal }
