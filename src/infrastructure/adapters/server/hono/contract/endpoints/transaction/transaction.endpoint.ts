import { body, endpoint, response } from '@airtasker/spot'

import type { VehicleTransaction } from '../../../../../../../domain/entities/transaction.entity.js'

@endpoint({
  method: 'POST',
  path: '/transactions',
})
export default class CreateTransaction {
  @response({ status: 201 })
  successResponse(@body _body: VehicleTransaction) {}

  @response({ status: 400 })
  badRequestResponse(@body body: ApiError) {}
}
