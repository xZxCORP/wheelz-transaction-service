import type { HealthCheckPort } from '../../../application/ports/health-check.port.js';
import type { QueuePort } from '../../../application/ports/queue.port.js';
import type { ServiceHealthStatus } from '../../../domain/entities/health-status.entity.js';

export class QueueHealthCheck implements HealthCheckPort {
  name = 'queue';

  constructor(private queue: QueuePort) {}

  async isHealthy(): Promise<ServiceHealthStatus> {
    const isRunning = await this.queue.isRunning();
    if (isRunning) {
      return {
        name: this.name,
        status: 'healthy',
      };
    } else {
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'Queue is not running',
      };
    }
  }
}
