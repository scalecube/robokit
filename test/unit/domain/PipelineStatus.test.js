const { toGitHub, toMarker, isTerminal } = require('../../../src/domain/PipelineStatus')

describe('PipelineStatus.toGitHub', () => {
  test.each([
    ['RUNNING',         { status: 'in_progress' }],
    ['SUCCEEDED',       { status: 'completed', conclusion: 'success' }],
    ['SUCCESS',         { status: 'completed', conclusion: 'success' }],
    ['TERMINAL',        { status: 'completed', conclusion: 'failure' }],
    ['FAILED_CONTINUE', { status: 'completed', conclusion: 'failure' }],
    ['ERROR',           { status: 'completed', conclusion: 'failure' }],
    ['CANCELLED',       { status: 'completed', conclusion: 'cancelled' }],
    ['PAUSED',          { status: 'completed', conclusion: 'cancelled' }],
    ['SUSPENDED',       { status: 'completed', conclusion: 'cancelled' }],
  ])('%s → %o', (envStatus, expected) => {
    expect(toGitHub(envStatus)).toEqual(expected)
  })

  test('unknown status falls back to in_progress', () => {
    expect(toGitHub('WHATEVER')).toEqual({ status: 'in_progress' })
    expect(toGitHub(undefined)).toEqual({ status: 'in_progress' })
  })

  test('CANCELED (one L) is NOT a known status — would be a silent bug', () => {
    // Guard against reintroducing the old CANCELED/CANCELLED typo
    expect(toGitHub('CANCELED')).toEqual({ status: 'in_progress' })
    expect(toGitHub('CANCELLED')).toEqual({ status: 'completed', conclusion: 'cancelled' })
  })
})

describe('PipelineStatus.toMarker', () => {
  test.each([
    ['SUCCEEDED',       '>'],
    ['SUCCESS',         '>'],
    ['TERMINAL',        '<'],
    ['FAILED_CONTINUE', '<'],
    ['ERROR',           '<'],
    ['CANCELLED',       '#'],
    ['PAUSED',          '#'],
    ['SUSPENDED',       '#'],
    ['RUNNING',         '*'],
  ])('%s → "%s"', (envStatus, marker) => {
    expect(toMarker(envStatus)).toBe(marker)
  })

  test('unknown status returns space', () => {
    expect(toMarker('WHATEVER')).toBe(' ')
    expect(toMarker(undefined)).toBe(' ')
  })
})

describe('PipelineStatus.isTerminal', () => {
  test.each(['SUCCEEDED', 'SUCCESS', 'TERMINAL', 'FAILED_CONTINUE', 'ERROR', 'CANCELLED', 'PAUSED', 'SUSPENDED'])(
    '%s is terminal', status => {
      expect(isTerminal(status)).toBe(true)
    }
  )

  test.each(['RUNNING', 'WHATEVER', undefined])(
    '%s is not terminal', status => {
      expect(isTerminal(status)).toBe(false)
    }
  )
})
