import * as dotenv from 'dotenv'
import { err, ok } from 'neverthrow'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../../domain/entities/config.entity.js'
import { ValidationError } from '../../../../domain/errors/domain.error.js'
import { ConfigSchema } from '../../../../domain/schemas/config.schema.js'
import { Validator } from '../../../../domain/validation/validator.js'
import { EnvironmentConfigLoader } from '../environment.config-loader.js'

vi.mock('dotenv', () => ({ configDotenv: vi.fn() }))

describe('EnvironmentConfigLoader', () => {
  let mockValidator: Validator
  let loader: EnvironmentConfigLoader
  let originalEnvironment: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnvironment = process.env
    process.env = {}
    mockValidator = { validate: vi.fn() }
    loader = new EnvironmentConfigLoader({} as ConfigSchema, mockValidator)
  })

  afterEach(() => {
    process.env = originalEnvironment
    vi.clearAllMocks()
  })

  it('should call configDotenv on instantiation', () => {
    expect(vi.mocked(dotenv.configDotenv)).toHaveBeenCalled()
  })

  it('should load all environment variables and return correct config', () => {
    process.env = {
      LOG_LEVEL: 'info',
      NOTIFICATION_QUEUE_URL: 'amqp://localhost',
      NOTIFICATION_QUEUE_NAME: 'transactions',
      API_HOST: 'localhost',
      API_PORT: '3000',
      DATA_SIGNER_ALGORITHM: 'RSA-SHA256',
      DATA_SIGNER_PRIVATE: 'privateKey',
    }

    const expectedConfig: Config = {
      logLevel: 'info',
      transactionQueue: {
        url: 'amqp://localhost',
        queueName: 'transactions',
      },
      api: {
        host: 'localhost',
        port: 3000,
      },
      dataSigner: {
        signAlgorithm: 'RSA-SHA256',
        privateKey: 'privateKey',
      },
    }

    vi.mocked(mockValidator.validate).mockReturnValue(ok(expectedConfig))

    const result = loader.load()

    expect(mockValidator.validate).toHaveBeenCalledWith(
      {},
      {
        logLevel: 'info',
        transactionQueue: {
          url: 'amqp://localhost',
          queueName: 'transactions',
        },
        api: {
          host: 'localhost',
          port: '3000',
        },
        dataSigner: {
          signAlgorithm: 'RSA-SHA256',
          privateKey: 'privateKey',
        },
      }
    )

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(expectedConfig)
    }
  })

  it('should handle missing environment variables', () => {
    const expectedConfig = {
      logLevel: 'info',
      transactionQueue: {
        url: '',
        queueName: '',
      },
      api: {
        host: 'localhost',
        port: 3000,
      },
      dataSigner: {
        signAlgorithm: '',
        privateKey: '',
      },
    }

    vi.mocked(mockValidator.validate).mockReturnValue(ok(expectedConfig))

    const result = loader.load()

    expect(mockValidator.validate).toHaveBeenCalledWith(
      {},
      {
        logLevel: undefined,
        transactionQueue: { url: undefined, queueName: undefined },
        api: { host: undefined, port: undefined },
        dataSigner: { signAlgorithm: undefined, privateKey: undefined },
      }
    )

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(expectedConfig)
    }
  })

  it('should return error on validation failure', () => {
    const validationError = new ValidationError('Invalid config', { field: 'error' })
    vi.mocked(mockValidator.validate).mockReturnValue(err(validationError))

    const result = loader.load()

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toEqual(validationError)
    }
  })

  it('should handle empty string values', () => {
    process.env = {
      LOG_LEVEL: '',
      NOTIFICATION_QUEUE_URL: '',
      NOTIFICATION_QUEUE_NAME: '',
      API_HOST: '',
      API_PORT: '',
      DATA_SIGNER_ALGORITHM: '',
      DATA_SIGNER_PRIVATE: '',
    }

    const expectedConfig = {
      logLevel: 'info',
      transactionQueue: {
        url: '',
        queueName: '',
      },
      api: {
        host: 'localhost',
        port: 3000,
      },
      dataSigner: {
        signAlgorithm: '',
        privateKey: '',
      },
    }

    vi.mocked(mockValidator.validate).mockReturnValue(ok(expectedConfig))

    const result = loader.load()

    expect(mockValidator.validate).toHaveBeenCalledWith(
      {},
      {
        logLevel: '',
        transactionQueue: { url: '', queueName: '' },
        api: { host: '', port: '' },
        dataSigner: { signAlgorithm: '', privateKey: '' },
      }
    )

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(expectedConfig)
    }
  })
})
