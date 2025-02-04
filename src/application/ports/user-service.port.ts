import type { User } from '@zcorp/wheelz-contracts';

export interface UserServicePort {
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
}
