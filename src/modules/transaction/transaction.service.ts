import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaginatedResult, PaginationQueryType } from 'src/types/util.types';
import { removeFields } from 'src/utils/object.util';
import type { TransactionResponseDTO } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: DatabaseService) {}

  async getUserTransactions(
    userId: bigint,
    query: PaginationQueryType,
  ): Promise<PaginatedResult<TransactionResponseDTO>> {
    const pagination = this.prismaService.handleQueryPagination(query);

    return this.prismaService.$transaction(async (prisma) => {
      const transactions = await prisma.userTransaction.findMany({
        ...removeFields(pagination, ['page']),
        where: { userId },
        select: {
          id: true,
          amount: true,
          type: true,
          paymentMethod: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const count = await prisma.userTransaction.count({
        where: { userId },
      });

      return {
        data: transactions,
        ...this.prismaService.formatPaginationResponse({
          page: pagination.page,
          count,
          limit: pagination.take,
        }),
      };
    });
  }
}
