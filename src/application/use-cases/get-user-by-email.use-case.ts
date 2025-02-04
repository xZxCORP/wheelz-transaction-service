import type { User } from '@zcorp/wheelz-contracts';

import type { UserServicePort } from '../ports/user-service.port.js';

export class GetUserByEmailUseCase {
  constructor(private readonly userService: UserServicePort) {}
  async execute(email: string): Promise<User | null> {
    return this.userService.getUserByEmail(email);
  }
}
