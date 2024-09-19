import { errAsync, okAsync } from 'neverthrow'
import { describe, expect, it, vi } from 'vitest'

import { QueueError } from '../../../../application/errors/application.error.js'
import { QueuePort } from '../../../../application/ports/queue.port.js'
import { QueueHealthCheck } from '../queue.health-check.js'

describe('QueueHealthCheck', () => {
  it('should return healthy status when queue is running', async () => {
    const mockQueue = {
      checkRunning: vi.fn().mockReturnValue(okAsync(undefined)),
    } as unknown as QueuePort

    const healthCheck = new QueueHealthCheck(mockQueue)
    const result = await healthCheck.isHealthy()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.name).toBe(healthCheck.name)
      expect(result.value.status).toBe('healthy')
    }
  })

  it('should return unhealthy status with error when queue is not running', async () => {
    const mockQueue = {
      checkRunning: vi.fn().mockReturnValue(errAsync(new QueueError('Queue is not running'))),
    } as unknown as QueuePort

    const healthCheck = new QueueHealthCheck(mockQueue)
    const result = await healthCheck.isHealthy()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.name).toBe(healthCheck.name)
      expect(result.value.status).toBe('unhealthy')
      expect(result.value.message).toBe('Queue is not running')
    }
  })
})
