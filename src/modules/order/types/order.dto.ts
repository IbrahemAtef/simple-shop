import { ApiProperty } from '@nestjs/swagger';

export class OrderItemDTO {
  @ApiProperty({ example: 1, description: 'Product ID' })
  productId!: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  qty!: number;
}

export type CreateOrderDTO = OrderItemDTO[];

export class CreateOrderReturnItemDTO {
  @ApiProperty({ example: 1, description: 'Product ID to return' })
  productId!: number;

  @ApiProperty({ example: 1, description: 'Quantity to return' })
  qty!: number;
}

export class CreateOrderReturnDTO {
  @ApiProperty({ example: 1, description: 'Order ID' })
  orderId!: number;

  @ApiProperty({
    type: [CreateOrderReturnItemDTO],
    description: 'List of items to return',
  })
  items!: CreateOrderReturnItemDTO[];
}

export class UpdateOrderStatusDTO {
  @ApiProperty({
    example: 'SUCCESS',
    enum: ['PENDING', 'SUCCESS'],
    description: 'Updated order status',
  })
  orderStatus!: 'PENDING' | 'SUCCESS';
}

export class UpdateReturnStatusDTO {
  @ApiProperty({
    example: 'REFUND',
    enum: ['PENDING', 'PICKED', 'REFUND'],
    description: 'Updated return status',
  })
  returnStatus!: 'PENDING' | 'PICKED' | 'REFUND';
}

export type CreateOrderResponseDTO = any;
export type OrderResponseDTO = any;
export type OrderOverviewResponseDTO = any;
