import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOfxFileDto {
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    fileName: string;
    
    @IsOptional()
    @IsString()
    userId: string;
}
