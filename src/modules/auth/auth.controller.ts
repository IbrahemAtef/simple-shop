import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO, UserResponseDTO } from './dto/auth.dto';
import { IsPublic } from 'src/decorators/public.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  loginValidationSchema,
  registerValidationSchema,
} from './util/auth-validation.schema';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ApiOperation({
    summary: 'Register a new user (CUSTOMER, MERCHANT, or ADMIN)',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or duplicate email',
  })
  async create(
    @Body(new ZodValidationPipe(registerValidationSchema))
    registerDTO: RegisterDTO,
  ): Promise<UserResponseDTO> {
    const createdUser = await this.authService.register(registerDTO);
    return createdUser;
  }

  @Post('login')
  @IsPublic()
  @ApiOperation({ summary: 'Authenticate user & retrieve JWT bearer token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  login(
    @Body(new ZodValidationPipe(loginValidationSchema)) loginDTO: LoginDTO,
  ): Promise<UserResponseDTO> {
    return this.authService.login(loginDTO);
  }

  @Get('validate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Validate active JWT session & return user profile',
  })
  @ApiResponse({ status: 200, description: 'Session token valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  validate(@Req() request: Request): UserResponseDTO {
    return this.authService.validate(request.user!);
  }
}
