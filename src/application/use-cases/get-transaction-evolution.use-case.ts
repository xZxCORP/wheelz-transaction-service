import type { TransactionStats, VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import dayjs from 'dayjs';

export class GetTransactionEvolutionUseCase {
  execute(transactions: VehicleTransaction[]) {
    const evolution: TransactionStats['evolution'] = [];
    const dateMap = new Map<string, VehicleTransaction[]>();

    let transactionsCount = 0;
    for (const transaction of transactions) {
      const formattedDate = dayjs(transaction.timestamp).format('YYYY-MM-DD');
      const oldData = dateMap.get(formattedDate) ?? [];
      dateMap.set(formattedDate, [...oldData, transaction]);
    }
    for (const [date, transactions] of dateMap.entries()) {
      evolution.push({
        date,
        value: transactions.length + transactionsCount,
      });

      transactionsCount += transactions.length;
    }
    return evolution;
  }
}
