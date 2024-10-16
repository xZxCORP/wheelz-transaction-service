import type { AbstractApplication } from './presentation/applications/base.application.js';

export async function bootstrap(application: AbstractApplication) {
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Graceful shutdown start');
    await application.stop();
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Graceful shutdown start');
    await application.stop();
  });

  await application.start();
}
