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
      override: true,
    });
  }
  async load(): Promise<Config> {
    const data = {
      logLevel: process.env.LOG_LEVEL,
      contractPath: process.env.CONTRACT_PATH,
      transactionQueue: {
        url: process.env.TRANSACTION_QUEUE_URL,
        completedQueueName: process.env.TRANSACTION_QUEUE_COMPLETED_NAME,
        newQueueName: process.env.TRANSACTION_QUEUE_NEW_NAME,
      },
      transactionRepository: {
        url: process.env.TRANSACTION_REPOSITORY_URL,
        database: process.env.TRANSACTION_REPOSITORY_DATABASE,
        collection: process.env.TRANSACTION_REPOSITORY_COLLECTION,
      },
      vehicleScraper: {
        url: process.env.VEHICLE_SCRAPER_URL,
      },
      transactionValidator: {
        url: process.env.TRANSACTION_VALIDATOR_URL,
      },
      api: {
        host: process.env.API_HOST,
        port: process.env.API_PORT,
      },
      dataSigner: {
        signAlgorithm: process.env.DATA_SIGNER_ALGORITHM,
        privateKey: process.env.DATA_SIGNER_PRIVATE,
      },
      authServiceUrl: process.env.AUTH_SERVICE_URL,
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
