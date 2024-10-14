import type { VehicleTransaction, VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import type { DataSignerPort } from '../ports/data-signer.port.js';
import type { DateProviderPort } from '../ports/date-provider.port.js';

export class CreateVehicleTransactionUseCase {
  constructor(
    private readonly dataSigner: DataSignerPort,
    private readonly dateProvider: DateProviderPort
  ) {}

  async execute(vehicleTransactionData: VehicleTransactionData): Promise<VehicleTransaction> {
    const currentDate = this.dateProvider.now();
    const signature = await this.dataSigner.sign(JSON.stringify(vehicleTransactionData));
    return {
      ...vehicleTransactionData,
      dataSignature: signature,
      timestamp: currentDate,
    };
  }
}
