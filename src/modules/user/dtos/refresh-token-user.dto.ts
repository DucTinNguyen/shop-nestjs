import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDtoRequest{

    @IsString()
    @ApiProperty()
    refreshToken: string;

}