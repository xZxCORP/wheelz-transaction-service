import { AMQPChannel, AMQPClient, AMQPQueue } from '@cloudamqp/amqp-client'
import { AMQPBaseClient } from '@cloudamqp/amqp-client/amqp-base-client'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

import { QueueError } from '../../../application/errors/application.error.js'
import { LoggerPort } from '../../../application/ports/logger.port.js'
import { QueuePort } from '../../../application/ports/queue.port.js'
import { Config } from '../../../domain/entities/config.entity.js'
import { AppError } from '../../../domain/errors/app.error.js'
import { ManagedResource } from '../../managed.resource.js'

export class RabbitMQQueue implements QueuePort, ManagedResource {
  public client: AMQPClient
  public connection: AMQPBaseClient | null = null
  public channel: AMQPChannel | null = null
  public queue: AMQPQueue | null = null
  constructor(
    public readonly config: Config,
    private readonly logger: LoggerPort
  ) {
    this.client = new AMQPClient(this.config.transactionQueue.url)
  }
  initialize(): ResultAsync<void, AppError> {
    return ResultAsync.fromPromise(
      this.client.connect(),
      (error) => new QueueError('Failed to connect to RabbitMQ', { cause: error })
    )
      .andThen((connection) => {
        this.connection = connection

        return ResultAsync.fromPromise(
          connection.channel(),
          (error) => new QueueError('Failed to create channel', { cause: error })
        )
      })
      .andThen((channel) => {
        this.channel = channel
        return ResultAsync.fromPromise(
          channel.queue(this.config.transactionQueue.queueName, { durable: true }),
          (error) => new QueueError('Failed to assert queue', { cause: error })
        )
      })
      .andThen((queue) => {
        this.queue = queue
        return okAsync(undefined)
      })
      .map(() => undefined)
  }

  dispose(): ResultAsync<void, AppError> {
    const closeChannel = this.channel
      ? ResultAsync.fromPromise(
          this.channel.close(),
          (error) => new QueueError('Failed to close channel', { cause: error })
        )
      : okAsync(undefined)

    const closeConnection = this.connection
      ? ResultAsync.fromPromise(
          this.connection.close(),
          (error) => new QueueError('Failed to close connection', { cause: error })
        )
      : okAsync(undefined)

    return closeChannel
      .andThen(() => closeConnection)
      .map(() => {
        this.channel = null
        this.connection = null
        this.logger.info('Rabbit mq cleaned')
      })
  }

  enqueue(data: unknown): ResultAsync<void, QueueError> {
    if (!this.queue) {
      return errAsync(new QueueError('Queue is not initialized'))
    }
    return ResultAsync.fromPromise(
      this.queue.publish(Buffer.from(JSON.stringify(data)), { deliveryMode: 2 }),
      (error) => new QueueError('Failed to enqueue message', { cause: error })
    ).map(() => undefined)
  }
}
