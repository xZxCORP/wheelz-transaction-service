import { supportedSignAlgorithms } from '@zcorp/shared-typing-wheelz';
import { z } from 'zod';

export const configSchema = z.object({
  logLevel: z.string(),
  transactionQueue: z.object({
    url: z.string(),
    completedQueueName: z.string(),
    newQueueName: z.string(),
  }),
  transactionRepository: z.object({
    url: z.string(),
    database: z.string(),
    collection: z.string(),
  }),
  transactionValidator: z.object({
    url: z.string(),
  }),
  vehicleScraper: z.object({
    url: z.string(),
  }),
  api: z.object({
    host: z.string(),
    port: z.coerce.number(),
  }),
  dataSigner: z.object({
    signAlgorithm: z.enum(supportedSignAlgorithms),
    privateKey: z.string(),
  }),
  authServiceUrl: z.string(),
  chainServiceUrl: z.string(),
});
export type Config = z.infer<typeof configSchema>;

export interface ConfigLoaderPort {
  load(): Promise<Config>;
}
