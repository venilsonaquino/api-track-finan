import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  icon: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  userId: string;
}
