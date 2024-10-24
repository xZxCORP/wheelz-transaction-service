import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { initServer } from '@ts-rest/fastify';
import { transactionContract } from '@zcorp/wheelz-contracts';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import type { ZodIssue } from 'zod';

import type { ManagedResource } from '../../../infrastructure/managed.resource.js';
import type { Config } from '../../../infrastructure/ports/config-loader.port.js';
import type { HealthcheckController } from '../../controllers/healthcheck.controller.js';
import type { TransactionController } from '../../controllers/transaction.controller.js';
import { openApiDocument } from '../open-api.js';
import { HealthcheckRouter } from '../routers/healthcheck.router.js';
import { TransactionRouter } from '../routers/transaction.router.js';

export class FastifyApiServer implements ManagedResource {
  fastifyInstance: FastifyInstance;
  private healthcheckRouter: HealthcheckRouter;
  private transactionRouter: TransactionRouter;

  constructor(
    private config: Config,
    private transactionController: TransactionController,
    private healthcheckController: HealthcheckController
  ) {
    const server = initServer();
    this.fastifyInstance = Fastify({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      },
    });
    this.fastifyInstance.register(cors, {
      origin: '*',
    });
    this.healthcheckRouter = new HealthcheckRouter(this.healthcheckController);
    this.transactionRouter = new TransactionRouter(this.transactionController);

    this.fastifyInstance.setErrorHandler((error, request, reply) => {
      reply.status(error.statusCode ?? 500).send({ message: error.message, data: error.cause });
    });

    server.registerRouter(
      transactionContract.health,
      {
        health: this.healthcheckRouter.health,
      },
      this.fastifyInstance
    );
    server.registerRouter(
      transactionContract.transactions,
      {
        getTransactions: this.transactionRouter.getTransactions,
        getTransactionById: this.transactionRouter.getTransactionById,
        submitTransaction: this.transactionRouter.submitTransaction,
        updateTransaction: this.transactionRouter.updateTransaction,
        deleteTransaction: this.transactionRouter.deleteTransaction,
      },
      this.fastifyInstance,
      {
        requestValidationErrorHandler: (error, request, reply) => {
          let mergedData: ZodIssue[] = [];
          if (error.body?.issues && error.body.issues.length > 0) {
            mergedData = [...mergedData, ...error.body.issues];
          }
          if (error.query?.issues && error.query.issues.length > 0) {
            mergedData = [...mergedData, ...error.query.issues];
          }
          return reply.status(400).send({ message: 'Validation failed', data: mergedData });
        },
      }
    );

    this.fastifyInstance
      .register(fastifySwagger, {
        transformObject: () => openApiDocument,
      })
      .register(fastifySwaggerUI, {
        routePrefix: '/ui',
      });
  }

  async initialize() {
    await this.fastifyInstance.listen({ port: this.config.api.port, host: this.config.api.host });
  }

  async dispose(): Promise<void> {
    await this.fastifyInstance.close();
  }
}
