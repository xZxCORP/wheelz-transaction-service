import type { Vehicle } from '@zcorp/shared-typing-wheelz';

import type { ChainServicePort } from '../../application/ports/chain-service.port.js';

export class TsrChainService implements ChainServicePort {
  async getVehicleOfTheChain(vin: string): Promise<Vehicle | null> {
    return null;
  }
}
