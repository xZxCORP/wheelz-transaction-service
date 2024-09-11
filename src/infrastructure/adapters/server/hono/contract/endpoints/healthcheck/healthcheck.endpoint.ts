import { body, endpoint, response } from '@airtasker/spot'

import type { OverallHealthStatus } from '../../../../../../../domain/entities/health-status.entity.js'

@endpoint({
  method: 'GET',
  path: '/health',
})
export default class Health {
  @response({ status: 200 })
  successResponse(@body _body: OverallHealthStatus) {}
}
