import { IsString } from "class-validator";

export class SignInShopRequestDto{
    @IsString()
    email: string

    @IsString()
    password: string
}