import { ApiProperty } from '@nestjs/swagger';

export class PayloadResponse {
  id: string;
  email: string;
  fullName: string;
  plan: string;
  iat?: number;
  exp?: number;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: PayloadResponse;

  @ApiProperty()
  expiresIn: number;
}
