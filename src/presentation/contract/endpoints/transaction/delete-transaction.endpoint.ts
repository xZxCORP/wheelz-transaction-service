import { body, defaultResponse, endpoint, request, response } from '@airtasker/spot'

import type { ApiError } from '../shared.dto.js'
import type { DeleteTransactionData, TransactionResponse } from './shared.dto.js'

/** Delete an existing transaction */
@endpoint({
  method: 'DELETE',
  path: '/transactions',
  tags: ['Transactions'],
})
export default class DeleteTransaction {
  /** Request to delete an existing transaction */
  @request
  request(@body _body: DeleteTransactionData) {}

  /** Successful response for transaction deletion */
  @response({ status: 200 })
  successResponse(@body _body: TransactionResponse) {}

  /** Error response for transaction delete */
  @defaultResponse
  errorResponse(@body _body: ApiError) {}
}
