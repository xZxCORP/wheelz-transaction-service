import { describe, expect, it, vi } from 'vitest';

import { InvalidTransactionError } from '../../domain/errors/invalid-transaction.error.js';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';
import type { LoggerPort } from '../ports/logger.port.js';
import type { AnalyseVehicleUseCase } from '../use-cases/analyse-vehicle.use-case.js';
import type { CalculateVehicleWithTransactionsUseCase } from '../use-cases/calculate-vehicle-with-transactions.use-case.js';
import type { CompareVehiclesUseCase } from '../use-cases/compare-vehicles.use-case.js';
import type { ConsumeCompletedVehicleTransactionsUseCase } from '../use-cases/consume-completed-vehicle-transactions.use-case.js';
import type { CountTransactionsOfActionWithVinUseCase } from '../use-cases/count-transactions-of-action-with-vin.use-case.js';
import type { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js';
import type { GetTransactionAnomaliesUseCase } from '../use-cases/get-transaction-anomalies.use-case.js';
import type { GetTransactionEvolutionUseCase } from '../use-cases/get-transaction-evolution.use-case.js';
import type { GetTransactionRepartitionUseCase } from '../use-cases/get-transaction-repartition.use-case.js';
import type { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.use-case.js';
import type { GetVehicleOfTheChainUseCase } from '../use-cases/get-vehicle-of-the-chain.use-case.js';
import type { GetVehicleTransactionByIdUseCase } from '../use-cases/get-vehicle-transaction-by-id.use-case.js';
import type { GetVehicleTransactionByVinOrImmatUseCase } from '../use-cases/get-vehicle-transaction-by-vin-or-immat.use-case.js';
import type { GetVehicleTransactionsUseCase } from '../use-cases/get-vehicle-transactions.use-case.js';
import type { GetVehicleTransactionsWithoutPaginationUseCase } from '../use-cases/get-vehicle-transactions-without-pagination.use-case.js';
import type { GetVinMetadatasUseCase } from '../use-cases/get-vin-metadatas.use-case.js';
import type { MapRawVehicleToVehicleUseCase } from '../use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import type { ReadRawVehicleFileUseCase } from '../use-cases/read-raw-vehicle-file.use-case.js';
import type { ResetVehicleTransactionsUseCase } from '../use-cases/reset-vehicle-transactions.use-case.js';
import type { ScrapVehicleDataUseCase } from '../use-cases/scrap-vehicle-data.use-case.js';
import { TransactionService } from './transaction.service.js';

type Mocks = {
  createVehicleTransactionUseCase: CreateVehicleTransactionUseCase;
  readRawVehicleFileUseCase: ReadRawVehicleFileUseCase;
  mapRawVehicleToVehicleUseCase: MapRawVehicleToVehicleUseCase;
  analyseVehicleUseCase: AnalyseVehicleUseCase;
  compareVehiclesUseCase: CompareVehiclesUseCase;
  resetVehicleTransactionsUseCase: ResetVehicleTransactionsUseCase;
  getVehicleTransactionsUseCase: GetVehicleTransactionsUseCase;
  getVehicleTransactionsWithoutPaginationUseCase: GetVehicleTransactionsWithoutPaginationUseCase;
  getVehicleTransactionByIdUseCase: GetVehicleTransactionByIdUseCase;
  getVehicleTransactionByVinOrImmatUseCase: GetVehicleTransactionByVinOrImmatUseCase;
  consumeCompletedVehicleTransactionsUseCase: ConsumeCompletedVehicleTransactionsUseCase;
  scrapVehicleDataUseCase: ScrapVehicleDataUseCase;
  getTransactionEvolutionUseCase: GetTransactionEvolutionUseCase;
  getTransactionRepartitionUseCase: GetTransactionRepartitionUseCase;
  getTransactionAnomaliesUseCase: GetTransactionAnomaliesUseCase;
  getVehicleOfTheChainUseCase: GetVehicleOfTheChainUseCase;
  calculateVehicleWithTransactionsUseCase: CalculateVehicleWithTransactionsUseCase;
  countTransactionsOfActionWithVinUseCase: CountTransactionsOfActionWithVinUseCase;
  getVinMetadatasUseCase: GetVinMetadatasUseCase;
  getUserByEmailUseCase: GetUserByEmailUseCase;
  logger: LoggerPort;
};

function buildSut(overrides: Partial<Mocks> = {}) {
  const mocks: Mocks = {
    createVehicleTransactionUseCase: { execute: vi.fn() } as any,
    readRawVehicleFileUseCase: { execute: vi.fn() } as any,
    mapRawVehicleToVehicleUseCase: { execute: vi.fn() } as any,
    analyseVehicleUseCase: { execute: vi.fn() } as any,
    compareVehiclesUseCase: { execute: vi.fn() } as any,
    resetVehicleTransactionsUseCase: { execute: vi.fn() } as any,
    getVehicleTransactionsUseCase: {
      execute: vi.fn().mockResolvedValue({
        items: [],
        meta: { page: 1, perPage: 10, total: 0 },
      }),
    } as any,
    getVehicleTransactionsWithoutPaginationUseCase: { execute: vi.fn() } as any,
    getVehicleTransactionByIdUseCase: { execute: vi.fn() } as any,
    getVehicleTransactionByVinOrImmatUseCase: { execute: vi.fn() } as any,
    consumeCompletedVehicleTransactionsUseCase: { execute: vi.fn() } as any,
    scrapVehicleDataUseCase: { execute: vi.fn() } as any,
    getTransactionEvolutionUseCase: { execute: vi.fn() } as any,
    getTransactionRepartitionUseCase: { execute: vi.fn() } as any,
    getTransactionAnomaliesUseCase: { execute: vi.fn() } as any,
    getVehicleOfTheChainUseCase: { execute: vi.fn() } as any,
    calculateVehicleWithTransactionsUseCase: { execute: vi.fn() } as any,
    countTransactionsOfActionWithVinUseCase: { execute: vi.fn() } as any,
    getVinMetadatasUseCase: { execute: vi.fn() } as any,
    getUserByEmailUseCase: { execute: vi.fn() } as any,
    logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  };
  Object.assign(mocks, overrides);

  const sut = new TransactionService(
    mocks.createVehicleTransactionUseCase,
    mocks.readRawVehicleFileUseCase,
    mocks.mapRawVehicleToVehicleUseCase,
    mocks.analyseVehicleUseCase,
    mocks.compareVehiclesUseCase,
    mocks.resetVehicleTransactionsUseCase,
    mocks.getVehicleTransactionsUseCase,
    mocks.getVehicleTransactionsWithoutPaginationUseCase,
    mocks.getVehicleTransactionByIdUseCase,
    mocks.getVehicleTransactionByVinOrImmatUseCase,
    mocks.consumeCompletedVehicleTransactionsUseCase,
    mocks.scrapVehicleDataUseCase,
    mocks.getTransactionEvolutionUseCase,
    mocks.getTransactionRepartitionUseCase,
    mocks.getTransactionAnomaliesUseCase,
    mocks.getVehicleOfTheChainUseCase,
    mocks.calculateVehicleWithTransactionsUseCase,
    mocks.countTransactionsOfActionWithVinUseCase,
    mocks.getVinMetadatasUseCase,
    mocks.getUserByEmailUseCase,
    mocks.logger
  );

  return { sut, mocks };
}

describe('TransactionService', () => {
  it('delegates pagination to GetVehicleTransactionsUseCase (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();

    // Act
    const result = await sut.getTransactions({ page: 1, perPage: 10 });

    // Assert
    expect(mocks.getVehicleTransactionsUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      perPage: 10,
    });
    expect(result).toEqual({ items: [], meta: { page: 1, perPage: 10, total: 0 } });
  });

  it('creates transaction on create action when valid and not duplicated (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.analyseVehicleUseCase.execute as any).mockResolvedValue({
      isValid: true,
      message: null,
    });
    (mocks.countTransactionsOfActionWithVinUseCase.execute as any)
      .mockResolvedValueOnce(0) // delete count
      .mockResolvedValueOnce(0); // create count
    (mocks.createVehicleTransactionUseCase.execute as any).mockResolvedValue({ id: 'tx-1' });

    const vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };

    // Act
    const result = await sut.processTransactionData(
      { action: 'create', data: vehicle },
      'user-1',
      false
    );

    // Assert
    expect(result.id).toBe('tx-1');
    expect(mocks.createVehicleTransactionUseCase.execute).toHaveBeenCalled();
  });

  it('throws InvalidTransactionError on create when external analysis is invalid (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.analyseVehicleUseCase.execute as any).mockResolvedValue({
      isValid: false,
      message: null,
    });

    const vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };

    // Act / Assert
    await expect(
      sut.processTransactionData({ action: 'create', data: vehicle }, 'user-1', false)
    ).rejects.toBeInstanceOf(InvalidTransactionError);
  });

  it('prevents duplicate create when create count > delete count (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.analyseVehicleUseCase.execute as any).mockResolvedValue({
      isValid: true,
      message: null,
    });
    (mocks.countTransactionsOfActionWithVinUseCase.execute as any)
      .mockResolvedValueOnce(0) // delete count
      .mockResolvedValueOnce(1); // create count

    const vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };

    // Act / Assert
    await expect(
      sut.processTransactionData({ action: 'create', data: vehicle }, 'user-1', false)
    ).rejects.toThrow('Une transaction avec ce VIN existe déjà');
  });

  it('throws when update and no previous vehicle found (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleOfTheChainUseCase.execute as any).mockResolvedValue(null);

    // Act / Assert
    await expect(
      sut.processTransactionData(
        { action: 'update', data: { vin: 'VIN1', changes: {} } as any },
        'user-1',
        false
      )
    ).rejects.toThrow('Impossible de trouver le véhicule dans la chaîne');
  });

  it('throws InvalidTransactionError when update comparison is invalid (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleOfTheChainUseCase.execute as any).mockResolvedValue({ vin: 'VIN1' });
    (mocks.compareVehiclesUseCase.execute as any).mockResolvedValue({
      isValid: false,
      message: null,
    });

    // Act / Assert
    await expect(
      sut.processTransactionData(
        { action: 'update', data: { vin: 'VIN1', changes: {} } as any },
        'user-1',
        false
      )
    ).rejects.toBeInstanceOf(InvalidTransactionError);
  });

  it('throws when update and no existing create transaction (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleOfTheChainUseCase.execute as any).mockResolvedValue({ vin: 'VIN1' });
    (mocks.compareVehiclesUseCase.execute as any).mockResolvedValue({
      isValid: true,
      message: null,
    });
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue(null);

    // Act / Assert
    await expect(
      sut.processTransactionData(
        { action: 'update', data: { vin: 'VIN1', changes: {} } as any },
        'user-1',
        false
      )
    ).rejects.toThrow("Aucune transaction avec ce VIN n'existe");
  });

  it('throws when update and create/delete counts are equal (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleOfTheChainUseCase.execute as any).mockResolvedValue({ vin: 'VIN1' });
    (mocks.compareVehiclesUseCase.execute as any).mockResolvedValue({
      isValid: true,
      message: null,
    });
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue({ id: 't1' });
    (mocks.countTransactionsOfActionWithVinUseCase.execute as any)
      .mockResolvedValueOnce(1) // for vin, 'delete'
      .mockResolvedValueOnce(1); // for vin, 'create'

    // Act / Assert
    await expect(
      sut.processTransactionData(
        { action: 'update', data: { vin: 'VIN1', changes: {} } as any },
        'user-1',
        false
      )
    ).rejects.toThrow("Aucune transaction avec ce VIN n'existe");
  });

  it('throws when delete and no existing create (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue(null);

    // Act / Assert
    await expect(
      sut.processTransactionData(
        { action: 'delete', data: { vin: 'VIN1' } as any },
        'user-1',
        false
      )
    ).rejects.toThrow('Impossible de supprimer une transaction avec un vin inexistant');
  });

  it('prevents duplicate delete when delete count >= create count (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue({ id: 't1' });
    (mocks.countTransactionsOfActionWithVinUseCase.execute as any)
      .mockResolvedValueOnce(1) // delete count
      .mockResolvedValueOnce(1); // create count

    // Act / Assert
    await expect(
      sut.processTransactionData(
        { action: 'delete', data: { vin: 'VIN1' } as any },
        'user-1',
        false
      )
    ).rejects.toThrow('Une transaction de suppression avec ce VIN existe déjà');
  });

  it('processVehicleDataFromFile imports vehicles: skips invalid, creates valid (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getUserByEmailUseCase.execute as any).mockResolvedValue({ id: 'admin-id' });
    (mocks.resetVehicleTransactionsUseCase.execute as any).mockResolvedValue(undefined);
    (mocks.readRawVehicleFileUseCase.execute as any).mockResolvedValue([{ a: 1 }, { b: 2 }]);
    (mocks.mapRawVehicleToVehicleUseCase.execute as any)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        vin: 'VIN1',
        features: {} as any,
        infos: {} as any,
        history: [],
        technicalControls: [],
        attachedClientsIds: [],
        sinisterInfos: {} as any,
      });
    (mocks.analyseVehicleUseCase.execute as any).mockResolvedValue({
      isValid: true,
      message: null,
    });
    (mocks.countTransactionsOfActionWithVinUseCase.execute as any)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    (mocks.createVehicleTransactionUseCase.execute as any).mockResolvedValue({ id: 'tx-1' });

    // Act
    await sut.processVehicleDataFromFile('path/to.json', 'admin@email');

    // Assert
    expect(mocks.resetVehicleTransactionsUseCase.execute).toHaveBeenCalled();
    expect(mocks.mapRawVehicleToVehicleUseCase.execute).toHaveBeenCalledTimes(2);
    expect(mocks.createVehicleTransactionUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mocks.logger.error).toHaveBeenCalled();
    expect(mocks.logger.info).toHaveBeenCalledWith('Vehicle transaction created: tx-1');
  });

  it('processVehicleDataFromFile throws if user not found (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getUserByEmailUseCase.execute as any).mockResolvedValue(null);

    // Act / Assert
    await expect(sut.processVehicleDataFromFile('path', 'missing@email')).rejects.toThrow(
      "Impossible de trouver l'utilisateur avec cet email"
    );
  });

  it('scrapAndProcessVehicleData returns existing if already present (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue({ id: 't1' });

    // Act
    const result = await sut.scrapAndProcessVehicleData(
      { vin: 'VIN1', immat: 'AA-123-BB' } as any,
      'user-1'
    );

    // Assert
    expect(result).toEqual({ id: 't1' });
  });

  it('scrapAndProcessVehicleData returns null when scraper returns no data (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue(null);
    (mocks.scrapVehicleDataUseCase.execute as any).mockResolvedValue({ data: null });

    // Act
    const result = await sut.scrapAndProcessVehicleData(
      { vin: 'VIN1', immat: 'AA-123-BB' } as any,
      'user-1'
    );

    // Assert
    expect(result).toBeNull();
  });

  it('scrapAndProcessVehicleData returns null when mapping fails (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue(null);
    (mocks.scrapVehicleDataUseCase.execute as any).mockResolvedValue({ data: { x: 1 } });
    (mocks.mapRawVehicleToVehicleUseCase.execute as any).mockResolvedValue(null);

    // Act
    const result = await sut.scrapAndProcessVehicleData(
      { vin: 'VIN1', immat: 'AA-123-BB' } as any,
      'user-1'
    );

    // Assert
    expect(result).toBeNull();
  });

  it('scrapAndProcessVehicleData processes when mapping succeeds (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByVinOrImmatUseCase.execute as any).mockResolvedValue(null);
    (mocks.scrapVehicleDataUseCase.execute as any).mockResolvedValue({ data: { x: 1 } });
    (mocks.mapRawVehicleToVehicleUseCase.execute as any).mockResolvedValue({
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    });
    (mocks.analyseVehicleUseCase.execute as any).mockResolvedValue({
      isValid: true,
      message: null,
    });
    (mocks.countTransactionsOfActionWithVinUseCase.execute as any)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    (mocks.createVehicleTransactionUseCase.execute as any).mockResolvedValue({ id: 'tx-2' });

    // Act
    const result = await sut.scrapAndProcessVehicleData(
      { vin: 'VIN1', immat: 'AA-123-BB' } as any,
      'user-1'
    );

    // Assert
    expect(result).toEqual({ id: 'tx-2' });
  });

  it('getTransactionStats aggregates evolution, repartition and anomalies (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionsWithoutPaginationUseCase.execute as any).mockResolvedValue([
      { id: 't1' },
    ]);
    (mocks.getTransactionEvolutionUseCase.execute as any).mockReturnValue([
      { date: 'd', value: 1 },
    ]);
    (mocks.getTransactionRepartitionUseCase.execute as any).mockReturnValue({
      type: {},
      status: {},
    });
    (mocks.getTransactionAnomaliesUseCase.execute as any).mockResolvedValue([
      { date: 'd', value: 0 },
    ]);

    // Act
    const result = await sut.getTransactionStats();

    // Assert
    expect(result.evolution).toEqual([{ date: 'd', value: 1 }]);
    expect(result.repartition).toEqual({ type: {}, status: {} });
    expect(result.anomalies).toEqual([{ date: 'd', value: 0 }]);
  });

  it('consumeCompletedTransactions logs and forwards to use case (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();

    // Act
    await sut.consumeCompletedTransactions();

    // Assert
    expect(mocks.logger.info).toHaveBeenCalledWith('Start consuming completed transactions');
    expect(mocks.consumeCompletedVehicleTransactionsUseCase.execute).toHaveBeenCalled();
  });

  it('revertTransaction throws when transaction not found (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByIdUseCase.execute as any).mockResolvedValue(null);

    // Act / Assert
    await expect(sut.revertTransaction('missing', 'user-1')).rejects.toBeInstanceOf(
      TransactionNotFoundError
    );
  });

  it('revertTransaction throws when transaction action is not delete (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByIdUseCase.execute as any).mockResolvedValue({
      id: 't1',
      action: 'create',
    });

    // Act / Assert
    await expect(sut.revertTransaction('t1', 'user-1')).rejects.toThrow(
      'Le revert ne peut être effectué que sur une transaction de suppression'
    );
  });

  it('revertTransaction throws when no calculated vehicle found (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByIdUseCase.execute as any).mockResolvedValue({
      id: 't1',
      action: 'delete',
      data: { vin: 'VIN1' },
    });
    (mocks.getVehicleTransactionsWithoutPaginationUseCase.execute as any).mockResolvedValue([
      { id: 't0' },
    ]);
    (mocks.calculateVehicleWithTransactionsUseCase.execute as any).mockReturnValue(null);

    // Act / Assert
    await expect(sut.revertTransaction('t1', 'user-1')).rejects.toThrow(
      'Impossible de trouver le véhicule dans les transactions précédentes'
    );
  });

  it('revertTransaction creates a new create transaction from calculated vehicle (AAA)', async () => {
    // Arrange
    const { sut, mocks } = buildSut();
    (mocks.getVehicleTransactionByIdUseCase.execute as any).mockResolvedValue({
      id: 't1',
      action: 'delete',
      data: { vin: 'VIN1' },
    });
    (mocks.getVehicleTransactionsWithoutPaginationUseCase.execute as any).mockResolvedValue([
      { id: 't0' },
    ]);
    (mocks.calculateVehicleWithTransactionsUseCase.execute as any).mockReturnValue({
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    });
    (mocks.createVehicleTransactionUseCase.execute as any).mockResolvedValue({ id: 'tx-new' });

    // Act
    const result = await sut.revertTransaction('t1', 'user-1');

    // Assert
    expect(result).toEqual({ id: 'tx-new' });
    expect(mocks.createVehicleTransactionUseCase.execute).toHaveBeenCalled();
  });
});
