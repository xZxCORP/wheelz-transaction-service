import { okAsync, ResultAsync } from 'neverthrow'

import { DateProviderError } from '../../../application/errors/application.error.js'
import { DateProviderPort } from '../../../application/ports/date-provider.port.js'

export class RealDateProvider implements DateProviderPort {
  now(): ResultAsync<Date, DateProviderError> {
    return okAsync(new Date())
  }
}
