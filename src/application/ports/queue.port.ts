import { ResultAsync } from 'neverthrow'

import { QueueError } from '../errors/application.error.js'

export interface QueuePort {
  enqueue(data: unknown): ResultAsync<void, QueueError>
}
