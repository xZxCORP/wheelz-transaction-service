import { okAsync, ResultAsync } from 'neverthrow';

import { HealthError } from '../../../application/errors/application.error.js';
import { HealthCheckPort } from '../../../application/ports/health-check.port.js';
import { QueuePort } from '../../../application/ports/queue.port.js';
import {
  HealthStatus,
  ServiceHealthStatus,
} from '../../../domain/entities/health-status.entity.js';

export class QueueHealthCheck implements HealthCheckPort {
  name = 'queue';

  constructor(private queue: QueuePort) {}

  isHealthy(): ResultAsync<ServiceHealthStatus, HealthError> {
    return this.queue
      .checkRunning()
      .map(() => ({
        name: this.name,
        status: 'healthy' as HealthStatus,
      }))
      .orElse((error) =>
        okAsync({
          name: this.name,
          status: 'unhealthy' as HealthStatus,
          message: error.message,
        })
      );
  }
}
