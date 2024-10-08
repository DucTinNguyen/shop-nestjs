import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SignInShopRequestDto{
    @IsString()
    @ApiProperty()
    email: string

    @IsString()
    @ApiProperty()
    password: string
}