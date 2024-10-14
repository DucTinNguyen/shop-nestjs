import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInUserDtoRequest {
    
    @IsString()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string;
    
}