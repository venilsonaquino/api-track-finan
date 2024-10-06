import { IsDefined, IsNotEmpty, IsEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsDefined()
  @IsDateString()
  dipostedDate: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  tranferType: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  transactionAmount: number;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @IsOptional()
  balanceAfter: number;

  @IsEmpty()
  @IsOptional()
  @IsString()
  categoryId: string;
}
