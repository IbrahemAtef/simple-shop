import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'generated/prisma';

export class RegisterDTO {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique user email address',
  })
  email!: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User account password',
  })
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CUSTOMER,
    description: 'User role (CUSTOMER, MERCHANT, ADMIN)',
  })
  role!: UserRole;
}

export class LoginDTO {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User account email',
  })
  email!: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User account password',
  })
  password!: string;
}

export class UserSummaryDTO {
  @ApiProperty({ example: '1', description: 'User ID' })
  id!: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  role!: UserRole;
}

export class UserResponseDTO {
  @ApiProperty({ description: 'JWT Access Token' })
  token!: string;

  @ApiProperty({ type: UserSummaryDTO })
  user!: UserSummaryDTO;
}
