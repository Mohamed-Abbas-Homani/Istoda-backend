import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ description: 'Username', example: 'john_doe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile picture file',
    required: false,
  })
  @IsOptional()
  profile_picture?: any;
}

export class LoginDto {
  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsNotEmpty()
  password: string;
}
