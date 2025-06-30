import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  walletType?: string;

  @IsString()
  @IsOptional()
  bankId?: string;

  @IsNumber()
  balance: number;
}
