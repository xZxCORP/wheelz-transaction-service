import type { Signature } from '@zcorp/shared-typing-wheelz';

export interface DataSignerPort {
  sign(data: string): Promise<Signature>;
}
