import { initClient, type InitClientReturn } from '@ts-rest/core';
import type { Vehicle } from '@zcorp/shared-typing-wheelz';
import { chainContract } from '@zcorp/wheelz-contracts';

import type { ChainServicePort } from '../../../application/ports/chain-service.port.js';
import { BaseTsRestService } from '../shared/base.ts-rest.js';

export class TsRestChainService extends BaseTsRestService implements ChainServicePort {
  private chainClient: InitClientReturn<typeof chainContract, { baseUrl: ''; baseHeaders: {} }>;

  constructor(
    private readonly chainServiceUrl: string,
    authServiceUrl: string,
    email: string,
    password: string
  ) {
    super(authServiceUrl, email, password);
    this.chainClient = initClient(chainContract, {
      baseUrl: this.chainServiceUrl,
    });
  }

  async getVehicleOfTheChain(vin: string): Promise<Vehicle | null> {
    const token = await this.getToken();
    if (!token) {
      return null;
    }
    const vehicle = await this.chainClient.chain.getVehicleOfTheChain({
      query: {
        vin,
      },
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
    if (vehicle.status === 200) {
      return vehicle.body;
    }

    return null;
  }
}
