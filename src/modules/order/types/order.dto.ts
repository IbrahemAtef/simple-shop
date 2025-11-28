import { Prisma } from 'generated/prisma';

export type CreateOrderDTO = { productId: number; qty: number }[];

export type CreateOrderResponseDTO = Prisma.OrderGetPayload<{
  include: {
    orderProducts: { include: { product: true } };
    transactions: true;
  };
}>;

export type OrderResponseDTO = Prisma.OrderGetPayload<{
  include: {
    orderProducts: { include: { product: true } };
    transactions: true;
    orderReturns: {
      include: { returnedItems: { include: { product: true } } };
    };
  };
}>;

export type OrderOverviewResponseDTO = Prisma.OrderGetPayload<{
  include: {
    orderProducts: {
      select: {
        totalQty: true;
        product: { select: { id: true; name: true } };
      };
    };
    orderReturns: { select: { id: true; status: true } };
    transactions: {
      where: { type: 'DEBIT' };
      select: { amount: true };
    };
  };
}>;

// return

export type CreateOrderReturnDTO = {
  orderId: number;
  items: { productId: number; qty: number }[];
};
