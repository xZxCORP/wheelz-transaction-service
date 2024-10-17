export interface QueuePort {
  enqueue(data: unknown): Promise<boolean>;
  clear(): Promise<boolean>;
  isRunning(): Promise<boolean>;
}
