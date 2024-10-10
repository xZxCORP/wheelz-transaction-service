import { errAsync, okAsync } from 'neverthrow';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import {
  createTransactionFixture,
  deleteTransactionFixture,
  updateTransactionFixture,
} from '../../../domain/fixtures/valid-transaction.fixture.js';
import { QueueError } from '../../errors/application.error.js';
import { QueuePort } from '../../ports/queue.port.js';
import { EnqueueTransactionUseCase } from '../enqueue-transaction.use-case.js';

describe('EnqueueTransactionUseCase', () => {
  const mockQueue = mock<QueuePort>();
  let useCase: EnqueueTransactionUseCase;

  beforeEach(() => {
    mockReset(mockQueue);
    useCase = new EnqueueTransactionUseCase(mockQueue);
  });

  it('should successfully enqueue a create transaction', async () => {
    mockQueue.checkRunning.mockReturnValue(okAsync(undefined));
    mockQueue.enqueue.mockReturnValue(okAsync(undefined));

    const result = await useCase.execute(createTransactionFixture);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(createTransactionFixture);
    expect(mockQueue.enqueue).toHaveBeenCalledWith(createTransactionFixture);
  });

  it('should successfully enqueue an update transaction', async () => {
    mockQueue.checkRunning.mockReturnValue(okAsync(undefined));
    mockQueue.enqueue.mockReturnValue(okAsync(undefined));

    const result = await useCase.execute(updateTransactionFixture);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(updateTransactionFixture);
    expect(mockQueue.enqueue).toHaveBeenCalledWith(updateTransactionFixture);
  });

  it('should successfully enqueue a delete transaction', async () => {
    mockQueue.checkRunning.mockReturnValue(okAsync(undefined));
    mockQueue.enqueue.mockReturnValue(okAsync(undefined));

    const result = await useCase.execute(deleteTransactionFixture);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(deleteTransactionFixture);
    expect(mockQueue.enqueue).toHaveBeenCalledWith(deleteTransactionFixture);
  });

  it('should return QueueError when enqueue fails', async () => {
    mockQueue.checkRunning.mockReturnValue(okAsync(undefined));
    mockQueue.enqueue.mockReturnValue(errAsync(new QueueError('Enqueue failed')));

    const result = await useCase.execute(createTransactionFixture);

    expect(result.isErr()).toBe(true);

    expect(result._unsafeUnwrapErr()).toBeInstanceOf(QueueError);
    expect(result._unsafeUnwrapErr().message).toBe('Enqueue failed');

    expect(mockQueue.enqueue).toHaveBeenCalledWith(createTransactionFixture);
  });

  it('should check if queue is running before enqueueing', async () => {
    mockQueue.checkRunning.mockReturnValue(okAsync(undefined));
    mockQueue.enqueue.mockReturnValue(okAsync(undefined));

    await useCase.execute(createTransactionFixture);

    expect(mockQueue.checkRunning).toHaveBeenCalled();
    expect(mockQueue.enqueue).toHaveBeenCalledWith(createTransactionFixture);
  });

  it('should not enqueue if queue is not running', async () => {
    mockQueue.checkRunning.mockReturnValue(errAsync(new QueueError('Queue is not running')));

    const result = await useCase.execute(createTransactionFixture);

    expect(result.isErr()).toBe(true);

    expect(result._unsafeUnwrapErr()).toBeInstanceOf(QueueError);
    expect(result._unsafeUnwrapErr().message).toBe('Queue is not running');

    expect(mockQueue.enqueue).not.toHaveBeenCalled();
  });

  it('should handle errors from checkRunning', async () => {
    mockQueue.checkRunning.mockReturnValue(errAsync(new QueueError('Check failed')));

    const result = await useCase.execute(createTransactionFixture);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(QueueError);
      expect(result.error.message).toBe('Check failed');
    }
    expect(mockQueue.enqueue).not.toHaveBeenCalled();
  });
});
