import { ResultAsync } from 'neverthrow';

export interface DateProviderPort {
  now(): Date;
}
