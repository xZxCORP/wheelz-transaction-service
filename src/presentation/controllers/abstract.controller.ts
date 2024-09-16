import { RouteDefinition } from '../types/http.js'
export abstract class AbstractController {
  abstract getRoutes(): RouteDefinition[]
}
