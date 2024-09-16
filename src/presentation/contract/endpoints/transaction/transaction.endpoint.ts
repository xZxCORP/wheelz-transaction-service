import { body, endpoint, response } from '@airtasker/spot'

import type { VehicleTransaction } from '../../../../domain/entities/transaction.entity.js'
import type { ApiErrorBody } from '../../../errors/api.error.js'

@endpoint({
  method: 'POST',
  path: '/transactions',
})
export default class CreateTransaction {
  @response({ status: 201 })
  successResponse(@body _body: VehicleTransaction) {}

  @response({ status: 400 })
  badRequestResponse(@body _body: ApiErrorBody) {}
}
