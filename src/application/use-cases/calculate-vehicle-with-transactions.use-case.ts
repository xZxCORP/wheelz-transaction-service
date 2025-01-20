import type { Vehicle, VehicleTransaction } from '@zcorp/shared-typing-wheelz';

export class CalculateVehicleWithTransactionsUseCase {
  execute(vin: string, transactions: VehicleTransaction[]): Vehicle | null {
    return null;
  }
}
