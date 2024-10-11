import { generateOpenApi } from '@ts-rest/open-api';
import { transactionContract } from '@zcorp/wheelz-contracts';

export const openApiDocument = generateOpenApi(
  transactionContract,
  {
    info: {
      title: 'Wheelz Transaction Service',
      version: '1.0.0',
    },
  },
  {
    setOperationId: true,
  }
);
