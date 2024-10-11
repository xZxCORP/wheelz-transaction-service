import { createSign } from 'node:crypto';

import type { DataSignerPort } from '../../../application/ports/data-signer.port.js';
import type {
  DataSignature,
  SignAlgorithm,
} from '../../../domain/entities/data-signature.entity.js';

export class CryptoDataSigner implements DataSignerPort {
  constructor(
    private readonly signAlgorithm: SignAlgorithm,
    private readonly privateKey: string
  ) {}

  sign(data: string): Promise<DataSignature> {
    try {
      const signer = createSign(this.signAlgorithm);
      signer.update(data);
      signer.end();

      const signature = signer.sign(this.privateKey, 'base64');

      return Promise.resolve({
        signAlgorithm: this.signAlgorithm,
        signature,
      });
    } catch {
      throw new Error('Error while signing data');
    }
  }
}
