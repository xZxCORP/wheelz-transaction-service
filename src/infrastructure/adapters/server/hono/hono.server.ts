import { Spot } from '@airtasker/spot'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { okAsync, ResultAsync } from 'neverthrow'

import { LoggerPort } from '../../../../application/ports/logger.port.js'
import { Config } from '../../../../domain/entities/config.entity.js'
import { AppError } from '../../../../domain/errors/app.error.js'
import { ServerError } from '../../../errors/infrastructure.errors.js'
import { ManagedResource } from '../../../managed.resource.js'
import { BaseController } from './controllers/base.controller.js'

export class HonoServer implements ManagedResource {
  public app: Hono
  public server: ReturnType<typeof serve> | null = null
  public controllers: BaseController[] = []

  constructor(
    private config: Config,
    private logger: LoggerPort
  ) {
    this.app = new Hono()
    this.setupMiddleware()
    this.setupBaseRoutes()
  }

  private setupMiddleware() {
    this.app.use(trimTrailingSlash())
    this.app.use(logger((message, ...rest) => this.logger.info(message, ...rest)))
    this.app.onError((error, c) => {
      this.logger.error('Error while processing request', error)
      return error instanceof HTTPException
        ? c.json({ message: error.message, data: error.cause }, error.status)
        : c.json({ message: 'Server error' }, 500)
    })
  }

  private async setupBaseRoutes() {
    const contract = Spot.parseContract(
      'src/infrastructure/adapters/server/hono/contract/api.contract.ts'
    )

    const spec = Spot.OpenApi3.generateOpenAPI3(contract)

    this.app.get('/openapi.json', (c) => c.json(spec))
    this.app.get('/ui', swaggerUI({ url: '/openapi.json' }))
  }

  public registerController(controller: BaseController) {
    this.controllers.push(controller)
    controller.setupRoutes(this.app)
    this.logger.info(`Registered controller ${controller.getName()}`)
  }

  private createServer(): ResultAsync<ReturnType<typeof serve>, ServerError> {
    return ResultAsync.fromPromise(
      new Promise<ReturnType<typeof serve>>((resolve, reject) => {
        const server = serve({
          fetch: this.app.fetch,
          hostname: this.config.api.host,
          port: this.config.api.port,
        })

        server.on('listening', () => {
          this.logger.info(
            `Server started on http://${this.config.api.host}:${this.config.api.port}`
          )
          resolve(server)
        })

        server.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EADDRINUSE') {
            reject(
              new ServerError(`Port ${this.config.api.port} is already in use`, { cause: error })
            )
          } else {
            reject(new ServerError('Failed to start Hono server', { cause: error }))
          }
        })
      }),
      (error: unknown) =>
        new ServerError('Unexpected error while starting Hono server', { cause: error })
    )
  }
  isRunning(): boolean {
    return this.server !== null && this.server.listening
  }

  initialize(): ResultAsync<void, AppError> {
    return this.createServer().andThen((server) => {
      this.server = server
      return okAsync(undefined)
    })
  }

  dispose(): ResultAsync<void, AppError> {
    if (!this.server) {
      return okAsync(undefined)
    }

    return ResultAsync.fromPromise(
      new Promise<void>((resolve) => {
        this.server!.close(() => {
          this.logger.info('Hono server stopped')
          this.server = null
          resolve()
        })
      }),
      (error: unknown) => new ServerError('Error while stopping Hono server', { cause: error })
    )
  }
}
