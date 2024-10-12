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
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  color?: string; 

  @IsNumber()
  balance: number;
}