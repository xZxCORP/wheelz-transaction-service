import type { TransactionStats, VehicleTransaction } from '@zcorp/shared-typing-wheelz';

export class GetTransactionRepartitionUseCase {
  execute(transactions: VehicleTransaction[]) {
    const repartition: TransactionStats['repartition'] = {
      status: {
        error: 0,
        pending: 0,
        finished: 0,
        total: 0,
      },
      type: {
        create: 0,
        update: 0,
        delete: 0,
        total: 0,
      },
    };

    for (const transaction of transactions) {
      switch (transaction.action) {
        case 'create': {
          repartition.type.create++;
          break;
        }
        case 'update': {
          repartition.type.update++;
          break;
        }
        case 'delete': {
          repartition.type.delete++;
          break;
        }
      }
      switch (transaction.status) {
        case 'error': {
          repartition.status.error++;
          break;
        }
        case 'pending': {
          repartition.status.pending++;
          break;
        }
        case 'finished': {
          repartition.status.finished++;
          break;
        }
      }
      repartition.type.total++;
      repartition.status.total++;
    }

    return repartition;
  }
}
