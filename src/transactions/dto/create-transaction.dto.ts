import { IsDefined, IsNotEmpty, IsEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsDefined()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  @IsOptional()
  balanceAfter: number;

  @IsEmpty()
  @IsOptional()
  @IsString()
  categoryId: string;
}
