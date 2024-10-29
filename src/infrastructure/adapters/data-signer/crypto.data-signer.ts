import { createSign } from 'node:crypto';

import type { SignAlgorithm, Signature } from '@zcorp/shared-typing-wheelz';

import type { DataSignerPort } from '../../../application/ports/data-signer.port.js';

export class CryptoDataSigner implements DataSignerPort {
  constructor(
    private readonly signAlgorithm: SignAlgorithm,
    private readonly privateKey: string
  ) {}

  sign(data: string): Promise<Signature> {
    try {
      const signer = createSign(this.signAlgorithm);
      signer.update(data);

      const signature = signer.sign(this.privateKey, 'hex');

      return Promise.resolve({
        signAlgorithm: this.signAlgorithm,
        signature,
      });
    } catch {
      throw new Error('Error while signing data');
    }
  }
}
