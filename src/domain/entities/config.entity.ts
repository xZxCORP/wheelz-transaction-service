import { SignAlgorithm } from './data-signature.entity.js'

export const MAX_PORT_VALUE = 65_535

export interface Config {
  logLevel: string
  contractPath: string
  transactionQueue: {
    url: string
    queueName: string
  }
  api: {
    host: string
    port: number
  }
  dataSigner: {
    signAlgorithm: SignAlgorithm
    privateKey: string
  }
}
