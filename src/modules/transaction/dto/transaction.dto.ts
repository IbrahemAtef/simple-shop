import { Prisma } from 'generated/prisma';

export type TransactionResponseDTO = Prisma.UserTransactionGetPayload<{
  select: {
    id: true;
    amount: true;
    type: true;
    paymentMethod: true;
    createdAt: true;
  };
}>;
