import { ResultAsync } from 'neverthrow';

import { DateProviderError } from '../errors/application.error.js';

export interface DateProviderPort {
  now(): ResultAsync<Date, DateProviderError>;
}
