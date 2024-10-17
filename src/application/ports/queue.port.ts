export interface QueuePort {
  enqueue(data: unknown): Promise<boolean>;
  consume(onReceived: (message: unknown) => Promise<void>): Promise<boolean>;
  clear(): Promise<boolean>;
  isRunning(): Promise<boolean>;
}
