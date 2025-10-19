import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'c93b7c68-3a45-4b67-8b7e-f3b5d7bfb8f2' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({
    example: 'https://example.com/images/profile.jpg',
    nullable: true,
  })
  profilePicture?: string;
}
