import { ResultAsync } from 'neverthrow';

import { DataSignature } from '../../domain/entities/data-signature.entity.js';
import { DataSignerError } from '../errors/application.error.js';

export interface DataSignerPort {
  sign(data: string): ResultAsync<DataSignature, DataSignerError>;
}
