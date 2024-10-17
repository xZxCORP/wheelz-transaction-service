import { readFile } from 'node:fs/promises';

import type { FileReaderPort } from '../../../application/ports/file-reader.port.js';

export class RealFileReader implements FileReaderPort {
  async read(filePath: string): Promise<string> {
    return readFile(filePath, 'utf8');
  }
}
