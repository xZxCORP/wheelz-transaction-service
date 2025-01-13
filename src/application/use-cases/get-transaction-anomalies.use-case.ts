import type { TransactionStats, VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import dayjs from 'dayjs';

import type { ExternalVehicleValidatorPort } from '../ports/external-vehicle-validator.port.js';

export class GetTransactionAnomaliesUseCase {
  constructor(private readonly externalVehicleValidator: ExternalVehicleValidatorPort) {}
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
        if (transaction.action === 'create') {
          const validationResult = await this.externalVehicleValidator.analyse(transaction.data);
          currentAnomamies += Number(!validationResult.isValid);
        }
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
