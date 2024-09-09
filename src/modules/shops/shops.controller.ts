import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInShopRequestDto, SignUpShopRequestDto } from './dtos';
import { ShopsService } from './shops.service';


@Controller('shops')
@ApiTags("Shop")
export class ShopsController {

    constructor(
        private readonly shopService: ShopsService
    ) {}

    @Post("/sign-up")
    async signUpShop(@Body() body: SignUpShopRequestDto){
        return this.shopService.signUpShop({...body})
    }

    @Post("/sign-in")
    async signInShop(@Body() body: SignInShopRequestDto) {
        return this.shopService.signInShop({...body})
    }
}
