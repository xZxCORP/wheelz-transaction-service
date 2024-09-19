import { body, defaultResponse, endpoint, response } from '@airtasker/spot'

import type { OverallHealthStatus } from '../../../../domain/entities/health-status.entity.js'
import type { ApiError } from '../shared.dto.js'

@endpoint({
  method: 'GET',
  path: '/health',
  tags: ['Health'],
})
export default class Health {
  @response({ status: 200 })
  successResponse(@body _body: OverallHealthStatus) {}

  @defaultResponse
  errorResponse(@body _body: ApiError) {}
}
