import { supportedSignAlgorithms } from '@zcorp/shared-typing-wheelz';
import { z } from 'zod';

export const configSchema = z.object({
  logLevel: z.string(),
  transactionQueue: z.object({
    url: z.string(),
    queueName: z.string(),
  }),
  api: z.object({
    host: z.string(),
    port: z.coerce.number(),
  }),
  dataSigner: z.object({
    signAlgorithm: z.enum(supportedSignAlgorithms),
    privateKey: z.string(),
  }),
});
export type Config = z.infer<typeof configSchema>;

export interface ConfigLoaderPort {
  load(): Promise<Config>;
}
