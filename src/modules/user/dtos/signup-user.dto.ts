import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignUpUserDtoRequest {
    
    @IsString()
    @ApiProperty()
    name: string

    @IsString()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string
}