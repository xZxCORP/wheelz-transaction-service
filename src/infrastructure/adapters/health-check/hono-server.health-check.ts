import { okAsync, ResultAsync } from 'neverthrow'

import { HealthError } from '../../../application/errors/application.error.js'
import { HealthCheckPort } from '../../../application/ports/health-check.port.js'
import { ServiceHealthStatus } from '../../../domain/entities/health-status.entity.js'
import { HonoServer } from '../server/hono/hono.server.js'

export class HonoServerHealthCheck implements HealthCheckPort {
  name = 'honoServer'

  constructor(private server: HonoServer) {}

  isHealthy(): ResultAsync<ServiceHealthStatus, HealthError> {
    return this.server.isRunning()
      ? okAsync({
          name: 'HonoServer',
          status: 'healthy',
        })
      : okAsync({
          name: 'HonoServer',
          status: 'unhealthy',
          message: 'Hono server is not running',
        })
  }
}
