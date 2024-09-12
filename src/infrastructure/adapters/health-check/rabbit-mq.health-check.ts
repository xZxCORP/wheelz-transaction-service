import { okAsync, ResultAsync } from 'neverthrow'

import { HealthError } from '../../../application/errors/application.error.js'
import { HealthCheckPort } from '../../../application/ports/health-check.port.js'
import { ServiceHealthStatus } from '../../../domain/entities/health-status.entity.js'
import { RabbitMQQueue } from '../queue/rabbit-mq.queue.js'

export class RabbitMQHealthCheck implements HealthCheckPort {
  name = 'RabbitMQ'

  constructor(private rabbitMq: RabbitMQQueue) {}

  isHealthy(): ResultAsync<ServiceHealthStatus, HealthError> {
    if (!this.rabbitMq.connection || !this.rabbitMq.channel || !this.rabbitMq.queue) {
      return okAsync({
        name: this.name,
        status: 'unhealthy',
        message: 'RabbitMQ connection is not initialized',
      })
    }
    if (this.rabbitMq.channel.closed) {
      return okAsync({
        name: this.name,
        status: 'unhealthy',
        message: 'RabbitMQ channel is closed',
      })
    }
    return okAsync({
      name: this.name,
      status: 'healthy',
    })
  }
}
