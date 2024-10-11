import { ResultAsync } from 'neverthrow';

export interface QueuePort {
  enqueue(data: unknown): Promise<boolean>;
  isRunning(): Promise<boolean>;
}
