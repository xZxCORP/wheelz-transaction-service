/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultAsync } from 'neverthrow'

import { ApiError } from '../errors/api.error.js'

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface HttpRequest {
  body: any
  params: Record<string, string>
  query: Record<string, string>
  headers: Record<string, string>
  method: HttpMethod
}

export interface HttpResponse {
  statusCode: number
  body: any
  headers?: Record<string, string>
}

export interface RouteHandler {
  (request: HttpRequest): ResultAsync<HttpResponse, ApiError>
}

export interface RouteDefinition {
  method: HttpMethod
  path: string
  handler: RouteHandler
}
