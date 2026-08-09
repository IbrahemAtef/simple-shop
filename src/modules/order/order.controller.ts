import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/decorators/roles.decorator';
import {
  CreateOrderResponseDTO,
  CreateOrderReturnDTO,
  OrderOverviewResponseDTO,
  OrderResponseDTO,
  OrderItemDTO,
  UpdateOrderStatusDTO,
  UpdateReturnStatusDTO,
} from './types/order.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createOrderDTOValidationSchema,
  createReturnDTOValidationSchema,
  updateOrderStatusSchema,
  updateReturnStatusSchema,
} from './util/order.validation.schema';
import { paginationSchema } from 'src/utils/api.util';
import type {
  PaginatedResult,
  PaginationQueryType,
} from 'src/types/util.types';
import { User } from 'src/decorators/user.decorator';
import { UserResponseDTO } from '../auth/dto/auth.dto';
import { IdempotencyInterceptor } from 'src/interceptors/idempotency.interceptor';
import { OrderStatus, UserRole, ReturnStatus } from 'generated/prisma';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Orders & Returns')
@ApiBearerAuth('JWT-auth')
@Controller('order')
@Roles([UserRole.ADMIN, UserRole.CUSTOMER])
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new purchase order with idempotency protection',
  })
  @ApiHeader({
    name: 'idempotency-key',
    required: false,
    description: 'Unique key to prevent duplicate order placements',
  })
  @ApiBody({ type: [OrderItemDTO] })
  @ApiResponse({ status: 201, description: 'Order successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid products or quantity' })
  @UseInterceptors(IdempotencyInterceptor)
  create(
    @Body(new ZodValidationPipe(createOrderDTOValidationSchema))
    createOrderDto: OrderItemDTO[],
    @User() user: UserResponseDTO['user'],
  ): Promise<CreateOrderResponseDTO> {
    return this.orderService.create(createOrderDto, BigInt(user.id));
  }

  // Admin: Update order status
  @Post(':id/status')
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiBody({ type: UpdateOrderStatusDTO })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateOrderStatusSchema))
    body: { orderStatus: OrderStatus },
  ): Promise<OrderResponseDTO> {
    return this.orderService.updateOrderStatus(id, body.orderStatus);
  }

  // Admin: Update return status
  @Post('return/:id/status')
  @Roles([UserRole.ADMIN])
  @ApiOperation({ summary: 'Update return status (Admin only)' })
  @ApiBody({ type: UpdateReturnStatusDTO })
  @ApiResponse({ status: 200, description: 'Return status updated' })
  async updateReturnStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateReturnStatusSchema))
    body: { returnStatus: ReturnStatus },
  ) {
    return this.orderService.updateReturnStatus(id, body.returnStatus);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user order history' })
  @ApiResponse({ status: 200, description: 'Paginated user orders' })
  findAll(
    @Req() request: Express.Request,
    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ): Promise<PaginatedResult<OrderOverviewResponseDTO>> {
    return this.orderService.findAll(BigInt(request.user!.id), query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({ status: 200, description: 'Order details' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(
    @Param('id') id: string,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.findOne(+id, BigInt(request.user!.id));
  }

  // returns end points

  // create return
  @Post('return')
  @ApiOperation({
    summary: 'Request order return/refund with idempotency protection',
  })
  @ApiHeader({
    name: 'idempotency-key',
    required: false,
    description: 'Unique key for idempotent return requests',
  })
  @ApiBody({ type: CreateOrderReturnDTO })
  @ApiResponse({ status: 201, description: 'Return request initialized' })
  @UseInterceptors(IdempotencyInterceptor)
  createReturn(
    @Body(new ZodValidationPipe(createReturnDTOValidationSchema))
    createReturnDto: CreateOrderReturnDTO,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.createReturn(
      createReturnDto,
      BigInt(request.user!.id),
    );
  }
}
