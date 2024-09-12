export const MAX_PORT_VALUE = 65_535
export interface Config {
  logLevel: string
  transactionQueue: {
    url: string
    queueName: string
  }
  api: {
    host: string
    port: number
  }
}
