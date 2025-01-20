import type { ChainServicePort } from '../ports/chain-service.port.js';

export class GetVehicleOfTheChainUseCase {
  constructor(private readonly chainService: ChainServicePort) {}

  async execute(vin: string) {
    return this.chainService.getVehicleOfTheChain(vin);
  }
}
