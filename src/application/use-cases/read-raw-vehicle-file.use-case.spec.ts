import { describe, expect, it } from 'vitest';

import type { FileReaderPort } from '../ports/file-reader.port.js';
import { ReadRawVehicleFileUseCase } from './read-raw-vehicle-file.use-case.js';

describe('ReadRawVehicleFileUseCase', () => {
  it('reads and sanitizes NaN/Infinity values (AAA)', async () => {
    // Arrange
    const fileReader: FileReaderPort = {
      read: async () => '[{"a":1,"b":NaN},{"a":2,"b":Infinity},{"a":3,"b":-Infinity}]',
    };
    const sut = new ReadRawVehicleFileUseCase(fileReader);

    // Act
    const result = await sut.execute('path');

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);
  });

  it('parses valid JSON content from file (AAA)', async () => {
    // Arrange (fake reader)
    const fileReader: FileReaderPort = {
      read: async () => '[{"x":1}]',
    };
    const sut = new ReadRawVehicleFileUseCase(fileReader);

    // Act
    const result = await sut.execute('path');

    // Assert
    expect(result).toEqual([{ x: 1 }]);
  });
});
