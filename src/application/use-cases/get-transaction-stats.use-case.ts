import type { TransactionStats } from '@zcorp/shared-typing-wheelz';

export class GetTransactionStatsUseCase {
  constructor() {}
  execute(): TransactionStats {
    return {
      anomalies: [],
      evolution: [
        {
          date: '2023-01-01',
          value: 10,
        },
        {
          date: '2023-02-01',
          value: 20,
        },
        {
          date: '2023-03-01',
          value: 30,
        },
      ],
      repartition: {
        status: {
          error: 10,
          pending: 20,
          finished: 30,
          total: 50,
        },
        type: {
          create: 10,
          update: 20,
          delete: 30,
          total: 50,
        },
      },
    };
  }
}
