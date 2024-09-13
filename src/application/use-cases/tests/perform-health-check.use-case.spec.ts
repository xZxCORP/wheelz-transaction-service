import { errAsync, okAsync } from 'neverthrow'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import { HealthError } from '../../errors/application.error.js'
import { HealthCheckPort } from '../../ports/health-check.port.js'
import { PerformHealthCheckUseCase } from '../perform-health-check.use-case.js'

describe('PerformHealthCheckUseCase', () => {
  let mockHealthCheck1: MockProxy<HealthCheckPort>
  let mockHealthCheck2: MockProxy<HealthCheckPort>
  let useCase: PerformHealthCheckUseCase

  beforeEach(() => {
    mockHealthCheck1 = mock<HealthCheckPort>()
    mockHealthCheck2 = mock<HealthCheckPort>()
    mockHealthCheck1.name = 'Service1'
    mockHealthCheck2.name = 'Service2'
  })

  it('should return healthy status when all checks pass', async () => {
    mockHealthCheck1.isHealthy.mockReturnValue(okAsync({ name: 'Service1', status: 'healthy' }))
    mockHealthCheck2.isHealthy.mockReturnValue(okAsync({ name: 'Service2', status: 'healthy' }))

    useCase = new PerformHealthCheckUseCase([mockHealthCheck1, mockHealthCheck2])
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
    mockHealthCheck1.isHealthy.mockReturnValue(okAsync({ name: 'Service1', status: 'healthy' }))
    mockHealthCheck2.isHealthy.mockReturnValue(
      okAsync({ name: 'Service2', status: 'unhealthy', message: 'Error' })
    )

    useCase = new PerformHealthCheckUseCase([mockHealthCheck1, mockHealthCheck2])
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
    mockHealthCheck1.isHealthy.mockReturnValue(errAsync(new HealthError('Check failed')))

    useCase = new PerformHealthCheckUseCase([mockHealthCheck1])
    const result = await useCase.execute()

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(HealthError)
      expect(result.error.message).toContain('Check failed')
    }
  })

  it('should handle mixed results from health checks', async () => {
    mockHealthCheck1.isHealthy.mockReturnValue(okAsync({ name: 'Service1', status: 'healthy' }))
    mockHealthCheck2.isHealthy.mockReturnValue(errAsync(new HealthError('Service2 check failed')))

    useCase = new PerformHealthCheckUseCase([mockHealthCheck1, mockHealthCheck2])
    const result = await useCase.execute()

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(HealthError)
      expect(result.error.message).toContain('Service2 check failed')
    }
  })
})
