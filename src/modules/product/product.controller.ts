import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDTO,
  ProductResponseDTO,
  ProductSwaggerResponseDTO,
  UpdateProductDTO,
} from './types/product.dto';
import type { ProductQuery } from './types/product.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  productSchema,
  productValidationSchema,
  updateProductValidationSchema,
} from './util/proudct.validation.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { ImageKitExceptionFilter } from 'src/exceptions/exception';
import { FileCleanupInterceptor } from '../file/cleanup-file.interceptor';
import { IdempotencyInterceptor } from 'src/interceptors/idempotency.interceptor';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@Controller('product')
@Roles(['MERCHANT'])
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Create product with optional image asset (Merchant only)',
  })
  @ApiHeader({
    name: 'idempotency-key',
    required: false,
    description: 'Unique key to prevent duplicate product creations',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductSwaggerResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation or image upload failed',
  })
  @UseInterceptors(
    IdempotencyInterceptor,
    FileInterceptor('file'),
    FileCleanupInterceptor,
  )
  @UseFilters(ImageKitExceptionFilter)
  create(
    @Body(new ZodValidationPipe(productValidationSchema))
    createProductDto: CreateProductDTO,
    @Req() request: Express.Request,
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<ProductResponseDTO> {
    return this.productService.create(createProductDto, request.user, file);
  }

  @Roles(['MERCHANT', 'CUSTOMER'])
  @Get()
  @ApiOperation({ summary: 'List all products with pagination & filtering' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'Headphones' })
  @ApiResponse({ status: 200, description: 'Paginated product list' })
  findAll(@Query(new ZodValidationPipe(productSchema)) query: ProductQuery) {
    return this.productService.findAll(query);
  }

  @Roles(['MERCHANT', 'CUSTOMER'])
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: ProductSwaggerResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product details or image (Merchant only)' })
  @ApiHeader({
    name: 'idempotency-key',
    required: false,
    description: 'Unique key for idempotent updates',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @UseInterceptors(
    IdempotencyInterceptor,
    FileInterceptor('file'),
    FileCleanupInterceptor,
  )
  @UseFilters(ImageKitExceptionFilter)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductValidationSchema))
    updatePayload: UpdateProductDTO,
    @Req()
    request: Express.Request,
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<ProductResponseDTO> {
    return this.productService.update(id, updatePayload, request.user, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete product (Merchant only)' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Express.Request,
  ) {
    return this.productService.remove(id, request.user);
  }
}
