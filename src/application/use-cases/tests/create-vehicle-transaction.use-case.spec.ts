import { errAsync, okAsync } from 'neverthrow'
import { beforeEach, describe, expect, it } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import {
  createTransactionDataFixture,
  createTransactionFixture,
  deleteTransactionDataFixture,
  deleteTransactionFixture,
  updateTransactionDataFixture,
  updateTransactionFixture,
} from '../../../domain/fixtures/valid-transaction.fixture.js'
import { DataSignerError, DateProviderError } from '../../errors/application.error.js'
import { DataSignerPort } from '../../ports/data-signer.port.js'
import { DateProviderPort } from '../../ports/date-provider.port.js'
import { CreateVehicleTransactionUseCase } from '../create-vehicle-transaction.use-case.js'

describe('CreateVehicleTransactionUseCase', () => {
  let dataSigner: MockProxy<DataSignerPort>
  let dateProvider: MockProxy<DateProviderPort>
  let useCase: CreateVehicleTransactionUseCase

  beforeEach(() => {
    dataSigner = mock<DataSignerPort>()
    dateProvider = mock<DateProviderPort>()
    useCase = new CreateVehicleTransactionUseCase(dataSigner, dateProvider)
  })

  it('should successfully create a vehicle transaction', async () => {
    const { timestamp, dataSignature } = createTransactionFixture

    dateProvider.now.mockReturnValue(okAsync(timestamp))
    dataSigner.sign.mockReturnValue(okAsync(dataSignature))

    const result = await useCase.execute(createTransactionDataFixture)

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(createTransactionFixture)
    }

    expect(dateProvider.now).toHaveBeenCalledOnce()
    expect(dataSigner.sign).toHaveBeenCalledWith(JSON.stringify(createTransactionDataFixture))
  })

  it('should successfully create an update transaction', async () => {
    const { timestamp, dataSignature } = updateTransactionFixture

    dateProvider.now.mockReturnValue(okAsync(timestamp))
    dataSigner.sign.mockReturnValue(okAsync(dataSignature))

    const result = await useCase.execute(updateTransactionDataFixture)

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(updateTransactionFixture)
    }
  })

  it('should successfully create a delete transaction', async () => {
    const { timestamp, dataSignature } = deleteTransactionFixture

    dateProvider.now.mockReturnValue(okAsync(timestamp))
    dataSigner.sign.mockReturnValue(okAsync(dataSignature))

    const result = await useCase.execute(deleteTransactionDataFixture)

    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(deleteTransactionFixture)
    }
  })

  it('should return an error when data signing fails', async () => {
    const { timestamp } = createTransactionFixture

    const signingError = new DataSignerError('Failed to sign data')
    dateProvider.now.mockReturnValue(okAsync(timestamp))
    dataSigner.sign.mockReturnValue(errAsync(signingError))

    const result = await useCase.execute(createTransactionDataFixture)

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(DataSignerError)
      expect(result.error.message).toBe('Failed to sign data')
    }
  })

  it('should return an error when date provider fails', async () => {
    const { dataSignature } = createTransactionFixture

    const dateError = new DateProviderError('Failed to get current date')
    dateProvider.now.mockReturnValue(errAsync(dateError))
    dataSigner.sign.mockReturnValue(okAsync(dataSignature))

    const result = await useCase.execute(createTransactionDataFixture)

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error)
    }
  })
})
