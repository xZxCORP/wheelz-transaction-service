import { err, ok } from 'neverthrow'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Config } from '../../../../domain/entities/config.entity.js'
import { ValidationError } from '../../../../domain/errors/domain.error.js'
import { ConfigSchema } from '../../../../domain/schemas/config.schema.js'
import { Validator } from '../../../../domain/validation/validator.js'
import { EnvironmentConfigLoader } from '../environment.config-loader.js'

vi.mock('dotenv', () => ({
  configDotenv: vi.fn(),
}))

describe('EnvironmentConfigLoader', () => {
  let mockConfigSchema: ConfigSchema
  let mockValidator: Validator
  let originalEnvironment: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnvironment = { ...process.env }

    process.env = {}

    mockConfigSchema = {} as ConfigSchema
    mockValidator = {
      validate: vi.fn(),
    } as unknown as Validator

    vi.mocked(mockValidator.validate).mockImplementation(() => ok({} as Config))
  })

  afterEach(() => {
    process.env = originalEnvironment
    vi.resetAllMocks()
  })

  it('should load a valid configuration', () => {
    process.env.LOG_LEVEL = 'info'
    process.env.NOTIFICATION_QUEUE_URL = 'amqp://localhost'
    process.env.NOTIFICATION_QUEUE_NAME = 'notifications'
    process.env.API_HOST = 'localhost'
    process.env.API_PORT = '3000'

    const expectedConfig: Config = {
      logLevel: 'info',
      notificationQueue: {
        url: 'amqp://localhost',
        queueName: 'notifications',
      },
      api: {
        host: 'localhost',
        port: 3000,
      },
    }

    vi.mocked(mockValidator.validate).mockReturnValue(ok(expectedConfig))

    const loader = new EnvironmentConfigLoader(mockConfigSchema, mockValidator)
    const result = loader.load()

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(expectedConfig)
    }

    expect(mockValidator.validate).toHaveBeenCalledWith(mockConfigSchema, {
      logLevel: 'info',
      notificationQueue: {
        url: 'amqp://localhost',
        queueName: 'notifications',
      },
      api: {
        host: 'localhost',
        port: '3000',
      },
    })
  })

  it('should return an error for invalid configuration', () => {
    process.env.LOG_LEVEL = 'debug'
    const validationError = new ValidationError('Invalid configuration', {})

    vi.mocked(mockValidator.validate).mockReturnValue(err(validationError))

    const loader = new EnvironmentConfigLoader(mockConfigSchema, mockValidator)
    const result = loader.load()

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toEqual(validationError)
    }
  })

  it('should handle missing environment variables', () => {
    const loader = new EnvironmentConfigLoader(mockConfigSchema, mockValidator)
    loader.load()

    expect(mockValidator.validate).toHaveBeenCalledWith(mockConfigSchema, {
      logLevel: undefined,
      notificationQueue: {
        url: undefined,
        queueName: undefined,
      },
      api: {
        host: undefined,
        port: undefined,
      },
    })
  })
})
