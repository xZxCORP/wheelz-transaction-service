import type { RawVehicle } from '../../domain/entities/cli-vehicle.entity.js';
import type { FileReaderPort } from '../ports/file-reader.port.js';

export class ReadRawVehicleFileUseCase {
  constructor(private readonly fileReader: FileReaderPort) {}

  async execute(path: string): Promise<RawVehicle[]> {
    const content = await this.fileReader.read(path);
    return JSON.parse(content.replaceAll(/:\s*(NaN|-?Infinity)/g, ': ""'));
  }
}
