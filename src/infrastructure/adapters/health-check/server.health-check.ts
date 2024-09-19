import { okAsync, ResultAsync } from 'neverthrow'

import { HealthError } from '../../../application/errors/application.error.js'
import { HealthCheckPort } from '../../../application/ports/health-check.port.js'
import { ServiceHealthStatus } from '../../../domain/entities/health-status.entity.js'
import { ServerPort } from '../../../presentation/ports/server.port.js'

export class ServerHealthCheck implements HealthCheckPort {
  name = 'server'

  constructor(private server: ServerPort) {}

  isHealthy(): ResultAsync<ServiceHealthStatus, HealthError> {
    return this.server.isRunning()
      ? okAsync({
          name: this.name,
          status: 'healthy',
        })
      : okAsync({
          name: this.name,
          status: 'unhealthy',
          message: 'Server is not running',
        })
  }
}
