import { initClient, type InitClientReturn } from '@ts-rest/core';
import type { Vehicle } from '@zcorp/shared-typing-wheelz';
import { authenticationContract, chainContract } from '@zcorp/wheelz-contracts';

import type { ChainServicePort } from '../../application/ports/chain-service.port.js';

export class TsRestChainService implements ChainServicePort {
  private chainClient: InitClientReturn<typeof chainContract, { baseUrl: ''; baseHeaders: {} }>;
  private authClient: InitClientReturn<
    typeof authenticationContract,
    { baseUrl: ''; baseHeaders: {} }
  >;
  constructor(
    private readonly chainServiceUrl: string,
    private readonly authServiceUrl: string,
    private readonly email: string,
    private readonly password: string
  ) {
    this.chainClient = initClient(chainContract, {
      baseUrl: this.chainServiceUrl,
    });
    this.authClient = initClient(authenticationContract, {
      baseUrl: this.authServiceUrl,
    });
  }
  private async fetchAndStoreNewToken(): Promise<string | null> {
    const loginResponse = await this.authClient.authentication.login({
      body: {
        email: this.email,
        password: this.password,
      },
    });
    if (loginResponse.status === 201) {
      return loginResponse.body.token;
    }
    return null;
  }
  private async getToken(): Promise<string | null> {
    const token = await this.fetchAndStoreNewToken();

    return token;
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
    if (vehicle.status === 401) {
      //TODO: retry
      return null;
    }
    return null;
  }
}
