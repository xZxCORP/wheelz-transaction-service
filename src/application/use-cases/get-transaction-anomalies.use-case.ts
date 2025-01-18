import type { TransactionStats, VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import dayjs from 'dayjs';

export class GetTransactionAnomaliesUseCase {
  constructor() {}
  async execute(transactions: VehicleTransaction[]) {
    const anomalies: TransactionStats['anomalies'] = [];
    const dateMap = new Map<string, VehicleTransaction[]>();

    let anomaliesCount = 0;
    for (const transaction of transactions) {
      const formattedDate = dayjs(transaction.timestamp).format('YYYY-MM-DD');
      const oldData = dateMap.get(formattedDate) ?? [];
      dateMap.set(formattedDate, [...oldData, transaction]);
    }
    for (const [date, transactions] of dateMap.entries()) {
      let currentAnomamies = 0;
      for (const transaction of transactions) {
        currentAnomamies += transaction.withAnomaly ? 1 : 0;
      }
      anomalies.push({
        date,
        value: currentAnomamies + anomaliesCount,
      });

      anomaliesCount += currentAnomamies;
    }
    return anomalies;
  }
}
