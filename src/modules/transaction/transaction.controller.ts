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

@Controller('transactions')
@Roles([UserRole.ADMIN, UserRole.CUSTOMER, UserRole.MERCHANT])
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getUserTransactions(
    @User() user: UserResponseDTO['user'],
    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ): Promise<PaginatedResult<TransactionResponseDTO>> {
    return this.transactionService.getUserTransactions(BigInt(user.id), query);
  }
}
