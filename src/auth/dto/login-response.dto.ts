import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: any;

  @ApiProperty()
  expires_in: number;
}