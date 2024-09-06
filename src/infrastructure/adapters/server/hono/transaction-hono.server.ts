import { Config } from '../../../../domain/entities/config.entity.js'
import { LoggerPort } from '../../../../domain/ports/logger.port.js'
import { AbstractHonoServer } from './abstract-hono.server.js'

export class TransactionHonoServer extends AbstractHonoServer {
  constructor(config: Config, logger: LoggerPort) {
    super(config, logger)
  }
  protected setupUserRoutes() {
    this.app.post('/api/transactions', async (c) => {
      const body = await c.req.json()
      this.logger.info('Transaction received', body)
    })
  }
}
