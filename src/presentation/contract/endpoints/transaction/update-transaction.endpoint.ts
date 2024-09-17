import { body, defaultResponse, endpoint, request, response } from '@airtasker/spot'

import type { ApiError } from '../shared.dto.js'
import type { TransactionResponse, UpdateTransactionData } from './shared.dto.js'

/** Update an existing transaction */
@endpoint({
  method: 'PATCH',
  path: '/transactions',
  tags: ['Transactions'],
})
export default class UpdateTransaction {
  /** Request to update an existing transaction */
  @request
  request(@body _body: UpdateTransactionData) {}

  /** Successful response for transaction update */
  @response({ status: 200 })
  successResponse(@body _body: TransactionResponse) {}

  /** Error response for transaction update */
  @defaultResponse
  errorResponse(@body _body: ApiError) {}
}
