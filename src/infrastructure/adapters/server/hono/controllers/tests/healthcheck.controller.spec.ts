import { Hono } from 'hono'
import { errAsync, okAsync } from 'neverthrow'
import { describe, expect, it, vi } from 'vitest'

import { HealthError } from '../../../../../../application/errors/application.error.js'
import { PerformHealthCheckUseCase } from '../../../../../../application/use-cases/perform-health-check.use-case.js'
import { OverallHealthStatus } from '../../../../../../domain/entities/health-status.entity.js'
import { HealthcheckController } from '../healthcheck.controller.js'

describe('HealthCheckController', () => {
  it('should return 200 and healthy status when all checks pass', async () => {
    const mockUseCase = {
      execute: vi.fn().mockReturnValue(
        okAsync({
          status: 'healthy',
          services: [{ name: 'TestService', status: 'healthy' }],
        })
      ),
    } as unknown as PerformHealthCheckUseCase

    const controller = new HealthcheckController(mockUseCase)
    const app = new Hono()
    controller.setupRoutes(app)

    const response = await app.request('/health')
    expect(response.status).toBe(200)

    const body = (await response.json()) as OverallHealthStatus
    expect(body.status).toBe('healthy')
    expect(body.services).toHaveLength(1)
    expect(body.services).toContainEqual({ name: 'TestService', status: 'healthy' })
  })

  it('should return 503 and unhealthy status when any check fails', async () => {
    const mockUseCase = {
      execute: vi.fn().mockReturnValue(
        okAsync({
          status: 'unhealthy',
          services: [{ name: 'TestService', status: 'unhealthy', message: 'Error' }],
        })
      ),
    } as unknown as PerformHealthCheckUseCase

    const controller = new HealthcheckController(mockUseCase)
    const app = new Hono()
    controller.setupRoutes(app)

    const response = await app.request('/health')
    expect(response.status).toBe(503)

    const body = (await response.json()) as OverallHealthStatus
    expect(body.status).toBe('unhealthy')
    expect(body.services).toHaveLength(1)
    expect(body.services).toContainEqual({
      name: 'TestService',
      status: 'unhealthy',
      message: 'Error',
    })
  })

  it('should return 500 when an error occurs', async () => {
    const mockUseCase = {
      execute: vi.fn().mockReturnValue(errAsync(new HealthError('Test error'))),
    } as unknown as PerformHealthCheckUseCase

    const controller = new HealthcheckController(mockUseCase)
    const app = new Hono()
    controller.setupRoutes(app)

    const response = await app.request('/health')
    expect(response.status).toBe(500)
  })
})
