import { ApiResponseProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TokenDtoResponse {
    
    @IsString()
    @ApiResponseProperty()
    accessToken: string;
    
    @IsString()
    @ApiResponseProperty()
    refreshToken: string;

}