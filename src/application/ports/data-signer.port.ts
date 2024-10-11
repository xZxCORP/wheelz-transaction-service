import { ResultAsync } from 'neverthrow';

import { type DataSignature } from '../../domain/entities/data-signature.entity.js';

export interface DataSignerPort {
  sign(data: string): Promise<DataSignature>;
}
