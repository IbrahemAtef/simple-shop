import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserRole } from 'generated/prisma';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { paginationSchema } from 'src/utils/api.util';
import type {
  PaginatedResult,
  PaginationQueryType,
} from 'src/types/util.types';
import type { TransactionResponseDTO } from './dto/transaction.dto';
import { UserResponseDTO } from '../auth/dto/auth.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Transactions & Ledger')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
@Roles([UserRole.ADMIN, UserRole.CUSTOMER, UserRole.MERCHANT])
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get financial transactions ledger for authenticated user',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated user credit/debit transaction history',
  })
  async getUserTransactions(
    @User() user: UserResponseDTO['user'],
    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ): Promise<PaginatedResult<TransactionResponseDTO>> {
    return this.transactionService.getUserTransactions(BigInt(user.id), query);
  }
}
