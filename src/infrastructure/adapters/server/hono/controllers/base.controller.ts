import { Hono } from 'hono'

export interface BaseController {
  setupRoutes(app: Hono): void
  getName(): string
}
