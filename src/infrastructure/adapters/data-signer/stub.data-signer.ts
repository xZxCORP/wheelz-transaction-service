import type { Signature } from '@zcorp/shared-typing-wheelz';

import type { DataSignerPort } from '../../../application/ports/data-signer.port.js';

export class StubDataSigner implements DataSignerPort {
  async sign(data: string): Promise<Signature> {
    return {
      signature: data + '-signature',
      signAlgorithm: 'RSA-SHA256',
    };
  }
}
