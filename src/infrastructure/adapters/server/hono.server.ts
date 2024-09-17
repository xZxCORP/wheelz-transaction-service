import { Spot } from '@airtasker/spot'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { Context, Hono } from 'hono'
import { logger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { BlankEnv, BlankInput } from 'hono/types'
import { StatusCode } from 'hono/utils/http-status'
import { JSONValue } from 'hono/utils/types'
import { okAsync, ResultAsync } from 'neverthrow'

import { LoggerPort } from '../../../application/ports/logger.port.js'
import { Config } from '../../../domain/entities/config.entity.js'
import { AppError } from '../../../domain/errors/app.error.js'
import { ApiError } from '../../../presentation/errors/api.error.js'
import { ServerPort } from '../../../presentation/ports/server.port.js'
import { HttpMethod, HttpRequest, RouteDefinition } from '../../../presentation/types/http.js'
import { ServerError } from '../../errors/infrastructure.errors.js'
import { ManagedResource } from '../../managed.resource.js'

export class HonoServer implements ServerPort, ManagedResource {
  private app: Hono
  private server: ReturnType<typeof serve> | null = null

  constructor(
    private config: Config,
    private logger: LoggerPort
  ) {
    this.app = new Hono()
    this.setupMiddleware()
    this.setupBaseRoutes()
  }

  registerRoute(route: RouteDefinition): void {
    const { method, path, handler } = route

    this.app[method](path, async (c) => {
      const request: HttpRequest = await this.createHttpRequest(c, method)

      const result = await handler(request)
      return result.match(
        (response) =>
          c.json(response.body as JSONValue, response.statusCode as StatusCode, response.headers),
        (error: ApiError) =>
          c.json(
            { code: error.code, message: error.message, cause: error.cause },
            error.statusCode as StatusCode
          )
      )
    })
    this.logger.info(`Registered route ${method.toUpperCase()} ${path}`)
  }

  private async createHttpRequest(
    c: Context<BlankEnv, string, BlankInput>,
    method: HttpMethod
  ): Promise<HttpRequest> {
    const body = ['get'].includes(method) ? undefined : await c.req.json()
    return {
      body,
      params: c.req.param(),
      query: Object.fromEntries(new URL(c.req.url).searchParams),
      headers: Object.fromEntries(c.req.raw.headers),
      method,
    }
  }

  private setupMiddleware() {
    this.app.use(trimTrailingSlash())
    this.app.use(logger((message, ...rest) => this.logger.info(message, ...rest)))
  }

  private setupBaseRoutes() {
    const contract = Spot.parseContract('src/presentation/contract/api.contract.ts')

    const spec = Spot.OpenApi3.generateOpenAPI3(contract)

    this.app.get('/openapi.json', (c) => c.json(spec))
    this.app.get('/ui', swaggerUI({ url: '/openapi.json' }))
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
