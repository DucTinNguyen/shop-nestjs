import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateShopDtoRequest {

    @IsString()
    @ApiProperty()
    name: string

    @IsString()
    @ApiProperty()
    email: string
}