export class TransactionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionNotFoundError';
  }
}
