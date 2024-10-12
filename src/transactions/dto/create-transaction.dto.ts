import { IsDefined, IsNotEmpty, IsString, IsDateString, IsEmpty, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsDefined()
  @IsDateString()
  dipostedDate: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  transferType: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  description: string;
  
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  amount: number;

  @IsEmpty()
  @IsOptional()
  @IsBoolean()
  isRecurring: boolean;

  @IsEmpty()
  @IsOptional()
  @IsNumber()
  recurringMonths: number;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  walletId: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  fitId: string;
}
