import { RouteDefinition } from '../types/http.js'

export interface ServerPort {
  registerRoute(route: RouteDefinition): void
  isRunning(): boolean
}
