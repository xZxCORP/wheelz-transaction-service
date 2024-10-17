import type { VehicleTransaction, VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import type { DataSignerPort } from '../ports/data-signer.port.js';
import type { DateProviderPort } from '../ports/date-provider.port.js';
import type { IdGeneratorPort } from '../ports/id-generator.port.js';

export class CreateVehicleTransactionUseCase {
  constructor(
    private readonly dataSigner: DataSignerPort,
    private readonly dateProvider: DateProviderPort,
    private readonly idGenerator: IdGeneratorPort
  ) {}

  async execute(vehicleTransactionData: VehicleTransactionData): Promise<VehicleTransaction> {
    const currentDate = this.dateProvider.now();
    const signature = await this.dataSigner.sign(JSON.stringify(vehicleTransactionData));
    const id = await this.idGenerator.generate();
    return {
      ...vehicleTransactionData,
      id,
      dataSignature: signature,
      timestamp: currentDate,
    };
  }
}
