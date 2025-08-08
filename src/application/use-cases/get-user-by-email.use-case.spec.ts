import { describe, expect, it, vi } from 'vitest';

import type { UserServicePort } from '../ports/user-service.port.js';
import { GetUserByEmailUseCase } from './get-user-by-email.use-case.js';

describe('GetUserByEmailUseCase', () => {
  it('delegates to user service (AAA)', async () => {
    // Arrange
    const userService: UserServicePort = {
      getUserByEmail: vi.fn().mockResolvedValue({ id: '1' } as any),
      getUserById: vi.fn() as any,
    };
    const sut = new GetUserByEmailUseCase(userService);

    // Act
    const result = await sut.execute('john@doe.com');

    // Assert
    expect(userService.getUserByEmail).toHaveBeenCalledWith('john@doe.com');
    expect(result).toEqual({ id: '1' });
  });

  it('returns null when user service cannot find user (AAA)', async () => {
    // Arrange
    const userService: UserServicePort = {
      getUserByEmail: vi.fn().mockResolvedValue(null),
      getUserById: vi.fn() as any,
    };
    const sut = new GetUserByEmailUseCase(userService);

    // Act
    const result = await sut.execute('missing@doe.com');

    // Assert
    expect(result).toBeNull();
  });
});
