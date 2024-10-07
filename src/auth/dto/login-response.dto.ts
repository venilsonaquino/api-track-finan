import { ApiProperty } from '@nestjs/swagger';

export class PayloadResponse {
  id: string;
  email: string;
  full_name: string;
  plan: string;
  iat?: number;
  exp?: number;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: PayloadResponse;

  @ApiProperty()
  expires_in: number;
}