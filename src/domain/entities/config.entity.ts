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
