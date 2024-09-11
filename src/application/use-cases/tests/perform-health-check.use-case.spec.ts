import { errAsync, okAsync } from 'neverthrow'
import { describe, expect, it, vi } from 'vitest'

import { HealthError } from '../../errors/application.error.js'
import { HealthCheckPort } from '../../ports/health-check.port.js'
import { PerformHealthCheckUseCase } from '../perform-health-check.use-case.js'

describe('PerformHealthCheckUseCase', () => {
  it('should return healthy status when all checks pass', async () => {
    const mockHealthCheck1: HealthCheckPort = {
      isHealthy: vi.fn().mockReturnValue(okAsync({ name: 'Service1', status: 'healthy' })),
      name: 'Service1',
    }
    const mockHealthCheck2: HealthCheckPort = {
      isHealthy: vi.fn().mockReturnValue(okAsync({ name: 'Service2', status: 'healthy' })),
      name: 'Service2',
    }

    const useCase = new PerformHealthCheckUseCase([mockHealthCheck1, mockHealthCheck2])
    const result = await useCase.execute()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.status).toBe('healthy')
      expect(result.value.services).toHaveLength(2)
      expect(result.value.services).toContainEqual({ name: 'Service1', status: 'healthy' })
      expect(result.value.services).toContainEqual({ name: 'Service2', status: 'healthy' })
    }
  })

  it('should return unhealthy status when any check fails', async () => {
    const mockHealthCheck1: HealthCheckPort = {
      isHealthy: vi.fn().mockReturnValue(okAsync({ name: 'Service1', status: 'healthy' })),
      name: 'Service1',
    }
    const mockHealthCheck2: HealthCheckPort = {
      isHealthy: vi
        .fn()
        .mockReturnValue(okAsync({ name: 'Service2', status: 'unhealthy', message: 'Error' })),
      name: 'Service2',
    }

    const useCase = new PerformHealthCheckUseCase([mockHealthCheck1, mockHealthCheck2])
    const result = await useCase.execute()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.status).toBe('unhealthy')
      expect(result.value.services).toHaveLength(2)
      expect(result.value.services).toContainEqual({ name: 'Service1', status: 'healthy' })
      expect(result.value.services).toContainEqual({
        name: 'Service2',
        status: 'unhealthy',
        message: 'Error',
      })
    }
  })

  it('should handle errors in health checks', async () => {
    const mockHealthCheck: HealthCheckPort = {
      isHealthy: vi.fn().mockReturnValue(errAsync(new HealthError('Check failed'))),
      name: 'Service1',
    }

    const useCase = new PerformHealthCheckUseCase([mockHealthCheck])
    const result = await useCase.execute()

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(HealthError)
      expect(result.error.message).toContain('Check failed')
    }
  })
})
