import { initClient, type InitClientReturn } from '@ts-rest/core';
import { type User, userContract } from '@zcorp/wheelz-contracts';

import type { UserServicePort } from '../../../application/ports/user-service.port.js';
import { BaseTsRestService } from '../shared/base.ts-rest.js';

export class TsRestUserService extends BaseTsRestService implements UserServicePort {
  private userClient: InitClientReturn<typeof userContract, { baseUrl: ''; baseHeaders: {} }>;

  constructor(
    private readonly userServiceUrl: string,
    authServiceUrl: string,
    email: string,
    password: string
  ) {
    super(authServiceUrl, email, password);
    this.userClient = initClient(userContract, {
      baseUrl: this.userServiceUrl,
    });
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const token = await this.getToken();
    if (!token) {
      return null;
    }
    const user = await this.userClient.users.getUsers({
      query: {
        email,
      },
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
    if (user.status === 200 && user.body.items.length > 0) {
      return user.body.items[0]!;
    }
    return null;
  }
}
