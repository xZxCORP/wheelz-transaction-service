import { body, defaultResponse, endpoint, request, response } from '@airtasker/spot'

import type { ApiError } from '../shared.dto.js'
import type { TransactionResponse, Vehicle } from './shared.dto.js'

@endpoint({
  method: 'POST',
  path: '/transactions',
  tags: ['Transactions'],
})
export default class CreateTransaction {
  /** Request to create a new transaction */
  @request
  request(@body _body: Vehicle) {}

  /** Successful response for transaction creation */
  @response({ status: 201 })
  successResponse(@body _body: TransactionResponse) {}

  /** Error response for transaction creation */
  @defaultResponse
  errorResponse(@body _body: ApiError) {}
}
