import { ResultAsync } from 'neverthrow'

import { PerformHealthCheckUseCase } from '../../application/use-cases/perform-health-check.use-case.js'
import { ApiError } from '../errors/api.error.js'
import { HttpRequest, HttpResponse, RouteDefinition } from '../types/http.js'
import { AbstractController } from './abstract.controller.js'

export class HealthcheckController extends AbstractController {
  constructor(private readonly performHealthCheckUseCase: PerformHealthCheckUseCase) {
    super()
  }

  getRoutes(): RouteDefinition[] {
    return [
      {
        method: 'get',
        path: '/health',
        handler: this.handleHealthCheck.bind(this),
      },
    ]
  }

  private handleHealthCheck(_request: HttpRequest): ResultAsync<HttpResponse, ApiError> {
    return this.performHealthCheckUseCase
      .execute()
      .map((healthStatus) => ({
        statusCode: healthStatus.status === 'healthy' ? 200 : 503,
        body: healthStatus,
      }))
      .mapErr((error) => ApiError.fromError(error))
  }
}
