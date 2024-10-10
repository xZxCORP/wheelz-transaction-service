import { ResultAsync } from 'neverthrow';

import { ServiceHealthStatus } from '../../domain/entities/health-status.entity.js';
import { HealthError } from '../errors/application.error.js';

export interface HealthCheckPort {
  name: string;

  isHealthy(): ResultAsync<ServiceHealthStatus, HealthError>;
}
