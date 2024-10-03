import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    refresh_token: string;
}