import type { ServiceHealthStatus } from '@zcorp/shared-typing-wheelz';

import type { HealthCheckPort } from '../../../application/ports/health-check.port.js';
import type { TransactionRepository } from '../../../domain/repositories/transaction.repository.js';

export class TransactionRepositoryHealthCheck implements HealthCheckPort {
  name = 'transaction';

  constructor(private transactionRepository: TransactionRepository) {}

  async isHealthy(): Promise<ServiceHealthStatus> {
    const isRunning = await this.transactionRepository.isRunning();
    if (isRunning) {
      return {
        name: this.name,
        status: 'healthy',
      };
    } else {
      return {
        name: this.name,
        status: 'unhealthy',
        message: 'Transaction repository is not running',
      };
    }
  }
}
