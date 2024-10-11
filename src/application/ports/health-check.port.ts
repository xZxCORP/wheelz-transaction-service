import { ResultAsync } from 'neverthrow';

import { type ServiceHealthStatus } from '../../domain/entities/health-status.entity.js';

export interface HealthCheckPort {
  name: string;

  isHealthy(): Promise<ServiceHealthStatus>;
}
