import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import { PerformHealthCheckUseCase } from '../../../../../application/use-cases/perform-health-check.use-case.js'
import { BaseController } from './base.controller.js'

export class HealthcheckController implements BaseController {
  constructor(protected readonly performHealthCheckUseCase: PerformHealthCheckUseCase) {}
  setupRoutes(app: Hono) {
    app.get('/healthcheck', async (c) => {
      const result = await this.performHealthCheckUseCase.execute()
      if (result.isErr()) {
        throw new HTTPException(500, result.error)
      }
      return c.json(result.value)
    })
  }
  getName() {
    return 'HealthcheckController'
  }
}
