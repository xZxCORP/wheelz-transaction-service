import { configDotenv } from 'dotenv';

import {
  type Config,
  type ConfigLoaderPort,
  configSchema,
} from '../../ports/config-loader.port.js';

export class EnvironmentConfigLoader implements ConfigLoaderPort {
  constructor(path: string = '.env') {
    configDotenv({
      path,
    });
  }
  async load(): Promise<Config> {
    const data = {
      logLevel: process.env.LOG_LEVEL,
      contractPath: process.env.CONTRACT_PATH,
      transactionQueue: {
        url: process.env.NOTIFICATION_QUEUE_URL,
        completedQueueName: process.env.NOTIFICATION_QUEUE_COMPLETED_NAME,
        newQueueName: process.env.NOTIFICATION_QUEUE_NEW_NAME,
      },
      api: {
        host: process.env.API_HOST,
        port: process.env.API_PORT,
      },
      dataSigner: {
        signAlgorithm: process.env.DATA_SIGNER_ALGORITHM,
        privateKey: process.env.DATA_SIGNER_PRIVATE,
      },
    };
    const config = await configSchema.safeParseAsync(data);
    if (!config.success) {
      throw new Error(config.error.name, {
        cause: config.error.flatten().fieldErrors,
      });
    }
    return config.data;
  }
}
