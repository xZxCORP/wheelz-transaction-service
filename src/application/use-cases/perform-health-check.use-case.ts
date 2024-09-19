import { ResultAsync } from 'neverthrow'

import { HealthStatus, OverallHealthStatus } from '../../domain/entities/health-status.entity.js'
import { HealthCheckPort } from '../ports/health-check.port.js'

export class PerformHealthCheckUseCase {
  constructor(private healthChecks: HealthCheckPort[]) {}

  execute() {
    return ResultAsync.combine(this.healthChecks.map((check) => check.isHealthy())).map(
      (results) => {
        const isOverallHealthy = results.every((result) => result.status === 'healthy')
        const status: HealthStatus = isOverallHealthy ? 'healthy' : 'unhealthy'
        return {
          status,
          services: results,
        } as OverallHealthStatus
      }
    )
  }
}
