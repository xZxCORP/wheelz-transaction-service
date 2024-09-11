import { Hono } from 'hono'

import { BaseController } from './base.controller.js'

export class HelloWorldController implements BaseController {
  public async getHello(): Promise<{ message: string }> {
    return { message: 'Hello World!' }
  }

  setupRoutes(app: Hono): void {
    app.get('/hello', async (c) => {
      const result = await this.getHello()
      return c.json(result)
    })
  }

  getName(): string {
    return 'HelloWorldController'
  }
}
