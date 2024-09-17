import { okAsync, ResultAsync } from 'neverthrow'

import { DataSignerError } from '../../../application/errors/application.error.js'
import { DataSignerPort } from '../../../application/ports/data-signer.port.js'
import { DataSignature } from '../../../domain/entities/data-signature.entity.js'

export class StubDataSigner implements DataSignerPort {
  sign(data: string): ResultAsync<DataSignature, DataSignerError> {
    return okAsync({
      publicKey: 'stub-public',
      signature: 'stub-signature',
    })
  }
}
