export const MAX_PORT_VALUE = 65_535
export interface Config {
  logLevel: string
  notificationQueue: {
    url: string
    queueName: string
  }
  api: {
    host: string
    port: number
  }
}
