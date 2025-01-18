import type { Vehicle } from '@zcorp/shared-typing-wheelz';

export interface ChainServicePort {
  getVehicleOfTheChain(vin: string): Promise<Vehicle | null>;
}
