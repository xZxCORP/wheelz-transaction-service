import type {
  UpdateVehicleTransactionData,
  Vehicle,
  VehicleTransaction,
} from '@zcorp/shared-typing-wheelz';

export class CalculateVehicleWithTransactionsUseCase {
  execute(vin: string, transactions: VehicleTransaction[]): Vehicle | null {
    const concernedTransactions = transactions.filter((transaction) => {
      return transaction.data.vin === vin;
    });
    if (concernedTransactions.length === 0) {
      return null;
    }
    let vehicle: Vehicle | null = null;
    for (const transaction of concernedTransactions) {
      switch (transaction.action) {
        case 'create': {
          vehicle = transaction.data;
          break;
        }
        case 'update': {
          if (vehicle) {
            vehicle = this._updateVehicle(vehicle, transaction.data);
          }
          break;
        }
        case 'delete': {
          vehicle = null;
          break;
        }
      }
    }
    return vehicle;
  }
  _updateVehicle(vehicle: Vehicle, transaction: UpdateVehicleTransactionData): Vehicle {
    const featuresChanges = transaction.changes.features;
    const infosChanges = transaction.changes.infos;
    const technicalControlsChanges = transaction.changes.technicalControls;
    const historyChanges = transaction.changes.history;
    const sinisterInfosChanges = transaction.changes.sinisterInfos;

    return {
      vin: vehicle.vin,
      features: {
        ...vehicle.features,
        ...featuresChanges,
      },
      infos: {
        ...vehicle.infos,
        ...infosChanges,
      },
      technicalControls: technicalControlsChanges ?? vehicle.technicalControls,
      history: historyChanges ?? vehicle.history,
      sinisterInfos: {
        ...vehicle.sinisterInfos,
        ...sinisterInfosChanges,
      },
    };
  }
}
