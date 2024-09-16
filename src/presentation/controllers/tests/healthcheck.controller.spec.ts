import { errAsync, okAsync } from 'neverthrow'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import { HealthError } from '../../../application/errors/application.error.js'
import { PerformHealthCheckUseCase } from '../../../application/use-cases/perform-health-check.use-case.js'
import { OverallHealthStatus } from '../../../domain/entities/health-status.entity.js'
import { ApiError } from '../../errors/api.error.js'
import { HttpRequest } from '../../types/http.js'
import { HealthcheckController } from '../healthcheck.controller.js'

describe('HealthcheckController', () => {
  let healthcheckController: HealthcheckController
  let mockPerformHealthCheckUseCase: MockProxy<PerformHealthCheckUseCase>

  beforeEach(() => {
    mockPerformHealthCheckUseCase = mock<PerformHealthCheckUseCase>()
    healthcheckController = new HealthcheckController(mockPerformHealthCheckUseCase)
  })

  it('should define the correct routes', () => {
    const routes = healthcheckController.getRoutes()
    expect(routes).toHaveLength(1)
    expect(routes[0]).toEqual({
      method: 'get',
      path: '/health',
      handler: expect.any(Function),
    })
  })

  it('should return healthy status when health check succeeds', async () => {
    const mockHealthStatus: OverallHealthStatus = { status: 'healthy', services: [] }
    mockPerformHealthCheckUseCase.execute.mockReturnValue(okAsync(mockHealthStatus))

    const mockRequest: HttpRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
      method: 'get',
    }

    const result = await healthcheckController.getRoutes()[0].handler(mockRequest)

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.statusCode).toBe(200)
      expect(result.value.body).toEqual(mockHealthStatus)
    }
    expect(mockPerformHealthCheckUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('should return unhealthy status when health check fails', async () => {
    const mockHealthStatus: OverallHealthStatus = {
      status: 'unhealthy',
      services: [{ name: 'service1', status: 'unhealthy' }],
    }
    mockPerformHealthCheckUseCase.execute.mockReturnValue(okAsync(mockHealthStatus))

    const mockRequest: HttpRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
      method: 'get',
    }

    const result = await healthcheckController.getRoutes()[0].handler(mockRequest)

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.statusCode).toBe(503)
      expect(result.value.body).toEqual(mockHealthStatus)
    }
    expect(mockPerformHealthCheckUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('should handle errors from the use case', async () => {
    const mockError = new HealthError('Health check failed')
    mockPerformHealthCheckUseCase.execute.mockReturnValue(errAsync(mockError))

    const mockRequest: HttpRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
      method: 'get',
    }

    const result = await healthcheckController.getRoutes()[0].handler(mockRequest)

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ApiError)
      expect(result.error.code).toBe('HEALTH_ERROR')
      expect(result.error.message).toBe('Health check failed')
      expect(result.error.statusCode).toBe(500)
    }
    expect(mockPerformHealthCheckUseCase.execute).toHaveBeenCalledTimes(1)
  })
})
