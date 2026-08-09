import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from 'generated/prisma';

export class CreateProductDTO {
  @ApiProperty({ example: 'Wireless Headphones', description: 'Product title' })
  name!: string;

  @ApiProperty({
    example: 'Noise-cancelling over-ear Bluetooth headphones.',
    description: 'Detailed product description',
  })
  description!: string;

  @ApiProperty({ example: 99.99, description: 'Product price in USD' })
  price!: number;
}

export class UpdateProductDTO {
  @ApiPropertyOptional({ example: 'Updated Headphones Name' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated product description' })
  description?: string;

  @ApiPropertyOptional({ example: 89.99 })
  price?: number;
}

export class AssetDTO {
  @ApiProperty({ example: '1' })
  id!: string;

  @ApiProperty({ example: 'https://ik.imagekit.io/demo/sample.jpg' })
  url!: string;

  @ApiProperty({ example: 'file_id_123' })
  fileId!: string;
}

export class ProductSwaggerResponseDTO {
  @ApiProperty({ example: '1' })
  id!: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  name!: string;

  @ApiProperty({ example: 'Noise-cancelling over-ear Bluetooth headphones.' })
  description!: string;

  @ApiProperty({ example: '99.99' })
  price!: any;

  @ApiProperty({ example: '10' })
  merchantId!: string;

  @ApiProperty({ example: false })
  isDeleted!: boolean;

  @ApiProperty({ type: [AssetDTO] })
  Asset!: AssetDTO[];
}

export type ProductResponseDTO = Prisma.ProductGetPayload<{
  include: {
    Asset: true;
  };
}>;
