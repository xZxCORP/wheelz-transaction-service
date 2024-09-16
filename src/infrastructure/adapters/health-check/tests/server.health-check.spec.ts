import { describe, expect, it, vi } from 'vitest'

import { ServerPort } from '../../../../presentation/ports/server.port.js'
import { HonoServer } from '../../server/hono.server.js'
import { ServerHealthCheck } from '../server.health-check.js'

describe('ServerHealthCheck', () => {
  it('should return healthy status when server is running', async () => {
    const mockServer = {
      isRunning: vi.fn().mockReturnValue(true),
    } as unknown as HonoServer

    const healthCheck = new ServerHealthCheck(mockServer)
    const result = await healthCheck.isHealthy()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.name).toBe(healthCheck.name)
      expect(result.value.status).toBe('healthy')
    }
  })

  it('should return unhealthy status when server is not running', async () => {
    const mockServer = {
      isRunning: vi.fn().mockReturnValue(false),
    } as unknown as ServerPort

    const healthCheck = new ServerHealthCheck(mockServer)
    const result = await healthCheck.isHealthy()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.name).toBe(healthCheck.name)
      expect(result.value.status).toBe('unhealthy')
      expect(result.value.message).toBe('Server is not running')
    }
  })
})
