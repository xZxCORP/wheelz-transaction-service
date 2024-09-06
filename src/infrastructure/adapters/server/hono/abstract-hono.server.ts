import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { okAsync, ResultAsync } from 'neverthrow'

import { Config } from '../../../../domain/entities/config.entity.js'
import { ServerError } from '../../../../domain/errors/domain.error.js'
import { LoggerPort } from '../../../../domain/ports/logger.port.js'
import { AbstractServer } from '../abstract.server.js'

export abstract class AbstractHonoServer extends AbstractServer {
  protected app: OpenAPIHono
  protected server: ReturnType<typeof serve> | null = null

  constructor(
    protected config: Config,
    protected logger: LoggerPort
  ) {
    super(config, logger)
    this.app = new OpenAPIHono()
    this.setupMiddleware()
    this.setupBaseRoutes()
    this.setupUserRoutes()
  }

  protected setupMiddleware() {
    this.app.use(trimTrailingSlash())
    this.app.use(logger((message, ...rest) => this.logger.info(message, ...rest)))
  }
  protected abstract setupUserRoutes(): void
  protected setupBaseRoutes() {
    this.app.doc31('/openapi.json', {
      openapi: '3.1.0',
      info: { title: 'Wheelz Transaction', version: '1' },
    })
    this.app.get('/ui', swaggerUI({ url: '/openapi.json' }))
  }

  protected createServer(): ResultAsync<ReturnType<typeof serve>, ServerError> {
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

  start(): ResultAsync<void, ServerError> {
    return this.createServer().andThen((server) => {
      this.server = server
      return okAsync(undefined)
    })
  }

  stop(): ResultAsync<void, ServerError> {
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
