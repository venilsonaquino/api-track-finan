import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password: string;
}