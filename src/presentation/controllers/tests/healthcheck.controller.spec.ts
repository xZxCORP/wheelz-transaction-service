import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';

import { HealthError } from '../../../application/errors/application.error.js';
import { PerformHealthCheckUseCase } from '../../../application/use-cases/perform-health-check.use-case.js';
import { OverallHealthStatus } from '../../../domain/entities/health-status.entity.js';
import { ApiError, errorToStatusCode } from '../../errors/api.error.js';
import { HttpRequest, HttpResponse } from '../../types/http.js';
import { HealthcheckController } from '../healthcheck.controller.js';

describe('HealthcheckController', () => {
  let controller: HealthcheckController;
  let mockUseCase: MockProxy<PerformHealthCheckUseCase>;

  beforeEach(() => {
    mockUseCase = mock<PerformHealthCheckUseCase>();
    controller = new HealthcheckController(mockUseCase);
  });

  it('defines correct route', () => {
    const routes = controller.getRoutes();
    expect(routes).toEqual([{ method: 'get', path: '/health', handler: expect.any(Function) }]);
  });

  const executeRequest = (): ResultAsync<HttpResponse, ApiError> => {
    const request: HttpRequest = { method: 'get' } as HttpRequest;
    const handler = controller.getRoutes()[0].handler;
    return handler(request);
  };

  describe('GET /health', () => {
    it('returns healthy status with 200 when health check succeeds', async () => {
      const mockHealthStatus: OverallHealthStatus = { status: 'healthy', services: [] };
      mockUseCase.execute.mockReturnValue(okAsync(mockHealthStatus));

      const result = await executeRequest();

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({
        statusCode: 200,
        body: mockHealthStatus,
      });
      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('returns unhealthy status with 503 when health check fails', async () => {
      const mockHealthStatus: OverallHealthStatus = {
        status: 'unhealthy',
        services: [{ name: 'service1', status: 'unhealthy' }],
      };
      mockUseCase.execute.mockReturnValue(okAsync(mockHealthStatus));

      const result = await executeRequest();

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({
        statusCode: 503,
        body: mockHealthStatus,
      });
      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('handles errors from the use case', async () => {
      const mockError = new HealthError('Health check failed');
      mockUseCase.execute.mockReturnValue(errAsync(mockError));

      const result = await executeRequest();

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe('HEALTH_ERROR');
      expect(error.message).toBe('Health check failed');
      expect(error.statusCode).toBe(errorToStatusCode['HEALTH_ERROR']);
      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
