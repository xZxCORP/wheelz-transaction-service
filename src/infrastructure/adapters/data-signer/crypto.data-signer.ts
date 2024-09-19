import { createSign } from 'node:crypto'

import { ResultAsync } from 'neverthrow'

import { DataSignerError } from '../../../application/errors/application.error.js'
import { DataSignerPort } from '../../../application/ports/data-signer.port.js'
import { Config } from '../../../domain/entities/config.entity.js'
import { DataSignature } from '../../../domain/entities/data-signature.entity.js'

export class CryptoDataSigner implements DataSignerPort {
  constructor(private readonly config: Config) {}

  sign(data: string): ResultAsync<DataSignature, DataSignerError> {
    return ResultAsync.fromPromise(
      this.signData(data),
      (error) => new DataSignerError('Unexpected error during signing', error)
    )
  }

  private async signData(data: string): Promise<DataSignature> {
    const signer = createSign(this.config.dataSigner.signAlgorithm)
    signer.update(data)
    signer.end()

    const signature = signer.sign(this.config.dataSigner.privateKey, 'base64')

    return {
      signAlgorithm: this.config.dataSigner.signAlgorithm,
      signature,
    }
  }
}
