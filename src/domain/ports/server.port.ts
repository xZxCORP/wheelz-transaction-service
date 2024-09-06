import { ResultAsync } from 'neverthrow'

import { ServerError } from '../errors/domain.error.js'

export interface ServerPort {
  start(): ResultAsync<void, ServerError>
  stop(): ResultAsync<void, ServerError>
}
