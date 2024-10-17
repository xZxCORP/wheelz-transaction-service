import { AMQPChannel, AMQPClient, AMQPQueue } from '@cloudamqp/amqp-client';
import { AMQPBaseClient } from '@cloudamqp/amqp-client/amqp-base-client';

import type { LoggerPort } from '../../../application/ports/logger.port.js';
import type { QueuePort } from '../../../application/ports/queue.port.js';
import type { ManagedResource } from '../../managed.resource.js';

export class RabbitMQQueue implements QueuePort, ManagedResource {
  public client: AMQPClient;
  public connection: AMQPBaseClient | null = null;
  public channel: AMQPChannel | null = null;
  public queue: AMQPQueue | null = null;
  constructor(
    private readonly url: string,
    private readonly queueName: string,
    private readonly logger: LoggerPort
  ) {
    this.client = new AMQPClient(this.url);
  }

  async isRunning(): Promise<boolean> {
    if (!this.connection || !this.channel || !this.queue) {
      return true;
    }
    if (this.connection.closed || this.channel.closed) {
      return false;
    }

    return true;
  }
  async initialize() {
    const connection = await this.client.connect();
    this.connection = connection;
    const channel = await this.client.channel();
    this.channel = channel;

    const queue = await channel.queue(this.queueName, { durable: true });
    this.queue = queue;
  }

  async dispose() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.channel = null;
    this.connection = null;
    this.queue = null;
    this.logger.info('RabbitMQ disposed');
  }

  async enqueue(data: unknown): Promise<boolean> {
    const isRunning = await this.isRunning();
    if (!isRunning) {
      return false;
    }
    try {
      await this.queue!.publish(Buffer.from(JSON.stringify(data)), { deliveryMode: 2 });
      return true;
    } catch {
      throw new Error('Error while enqueuing data');
    }
  }
  async consume(onReceived: (message: unknown) => Promise<void>): Promise<boolean> {
    const isRunning = await this.isRunning();
    if (!isRunning) {
      return false;
    }
    try {
      await this.channel!.prefetch(1);
      await this.channel!.basicConsume(this.queueName, { noAck: false }, async (message) => {
        const content = message.bodyToString();
        if (content) {
          try {
            const parsed = JSON.parse(content);
            await onReceived(parsed);
            await message.ack();
          } catch {
            await message.nack(true);
          }
        }
      });
      this.logger.info(`Started consuming messages from queue: ${this.queueName}`);
      return true;
    } catch {
      throw new Error('Failed to set up message consumer');
    }
  }

  async clear(): Promise<boolean> {
    const isRunning = await this.isRunning();
    if (!isRunning) {
      return false;
    }
    try {
      await this.queue!.purge();
      return true;
    } catch {
      throw new Error('Error while clear queue');
    }
  }
}
