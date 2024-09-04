import { Application } from './infrastructure/application.js'

async function bootstrap() {
  const applicationResult = Application.create()
  if (applicationResult.isErr()) {
    console.error('Failed to create application:', applicationResult.error)
    process.exit(1)
  }
  const application = applicationResult.value
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Graceful shutdown start')
    await application.stop()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Graceful shutdown start')
    await application.stop()
    process.exit(0)
  })

  const result = await application.start()
  if (result.isErr()) {
    console.error(result.error)
    process.exit(1)
  }
}

bootstrap().catch((error) => {
  console.error('Unhandled error:', error)
  process.exit(1)
})
