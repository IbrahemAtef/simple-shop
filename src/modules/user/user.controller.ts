import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { PaginationQueryType } from 'src/types/util.types';
import type { UpdateUserDTO } from './dto/user.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { updateUserValidationSchema } from './util/user.validation.schema';
import { paginationSchema } from 'src/utils/api.util';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all users with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Paginated user list' })
  findAll(
    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'User profile details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: bigint) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile details' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  update(
    @Param('id') id: bigint,
    @Body(new ZodValidationPipe(updateUserValidationSchema))
    userUpdatePayload: UpdateUserDTO,
  ) {
    return this.userService.update(id, userUpdatePayload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete user account' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async remove(@Param('id') id: bigint) {
    const removedUser = await this.userService.remove(id);
    return Boolean(removedUser);
  }
}
