export interface FileReaderPort {
  read: (path: string) => Promise<string>;
}
