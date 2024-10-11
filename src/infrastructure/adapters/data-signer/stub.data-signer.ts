import { okAsync, ResultAsync } from 'neverthrow';

import type { DataSignerPort } from '../../../application/ports/data-signer.port.js';
import type { DataSignature } from '../../../domain/entities/data-signature.entity.js';

export class StubDataSigner implements DataSignerPort {
  async sign(data: string): Promise<DataSignature> {
    return {
      signature: data + '-signature',
      signAlgorithm: 'RSA-SHA256',
    };
  }
}
