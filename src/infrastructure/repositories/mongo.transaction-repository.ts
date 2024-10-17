import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import { type Collection, type Db, MongoClient, type WithId } from 'mongodb';

import type { LoggerPort } from '../../application/ports/logger.port.js';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { ManagedResource } from '../managed.resource.js';

export class MongoTransactionRepository implements TransactionRepository, ManagedResource {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<VehicleTransaction> | null = null;

  constructor(
    private readonly uri: string,
    private readonly databaseName: string,
    private readonly collectionName: string,
    private readonly logger: LoggerPort
  ) {}

  private mapToTransaction(
    mongodbVehicleTransaction: WithId<VehicleTransaction>
  ): VehicleTransaction {
    return {
      action: mongodbVehicleTransaction.action,
      timestamp: mongodbVehicleTransaction.timestamp,
      data: mongodbVehicleTransaction.data,
      id: mongodbVehicleTransaction.id,
      status: mongodbVehicleTransaction.status,
      dataSignature: mongodbVehicleTransaction.dataSignature,
    } as VehicleTransaction;
  }

  async isRunning(): Promise<boolean> {
    if (!this.client || !this.db || !this.collection) {
      return false;
    }
    try {
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }

  async initialize(): Promise<void> {
    this.client = await MongoClient.connect(this.uri, {
      connectTimeoutMS: 2000,
      socketTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000,
    });
    this.db = this.client.db(this.databaseName);
    this.collection = this.db.collection<VehicleTransaction>(this.collectionName);
    await this.collection.createIndex({ id: 1 }, { unique: true });

    this.logger.info('MongoDB initialized');
  }
  async dispose(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client.removeAllListeners();
    }
    this.db = null;
    this.collection = null;
    this.client = null;
    this.logger.info('MongoDB disposed');
  }

  async changeStatus(transactionId: string, status: 'pending' | 'finished'): Promise<void> {
    await this.collection!.updateOne({ id: transactionId }, { $set: { status } });
  }

  async getAll(): Promise<any[]> {
    const transactions = await this.collection!.find().toArray();
    return transactions.map((element) => this.mapToTransaction(element));
  }

  async removeAll(): Promise<void> {
    await this.collection!.deleteMany({});
  }

  async save(transaction: VehicleTransaction): Promise<void> {
    await this.collection!.insertOne(transaction);
  }
}
