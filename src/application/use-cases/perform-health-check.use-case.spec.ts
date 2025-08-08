import { describe, expect, it } from 'vitest';

import type { HealthCheckPort } from '../ports/health-check.port.js';
import { PerformHealthCheckUseCase } from './perform-health-check.use-case.js';

describe('PerformHealthCheckUseCase', () => {
  it('aggregates health statuses (AAA)', async () => {
    // Arrange
    const healthy: HealthCheckPort = {
      name: 'ok',
      isHealthy: async () => ({ name: 'ok', status: 'healthy' }),
    };
    const unhealthy: HealthCheckPort = {
      name: 'ko',
      isHealthy: async () => ({ name: 'ko', status: 'unhealthy', message: 'down' }),
    };
    const sut = new PerformHealthCheckUseCase([healthy, unhealthy]);

    // Act
    const result = await sut.execute();

    // Assert
    expect(result.status).toBe('unhealthy');
    expect(result.services.length).toBe(2);
  });

  it('returns healthy when all services are healthy (AAA)', async () => {
    // Arrange
    const a: HealthCheckPort = {
      name: 'a',
      isHealthy: async () => ({ name: 'a', status: 'healthy' }),
    };
    const b: HealthCheckPort = {
      name: 'b',
      isHealthy: async () => ({ name: 'b', status: 'healthy' }),
    };
    const sut = new PerformHealthCheckUseCase([a, b]);

    // Act
    const result = await sut.execute();

    // Assert
    expect(result.status).toBe('healthy');
  });
});
