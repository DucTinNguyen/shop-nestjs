import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpShopRequestDto } from './dtos/sign-up-shop.dto';
import { ShopsService } from './shops.service';

@Controller('shops')
@ApiTags("Shop")
export class ShopsController {

    constructor(
        private readonly shopService: ShopsService
    ) {}

    @Post("/sign-up")
    async signUpShop(@Body() body: SignUpShopRequestDto) {
        return this.shopService.signUpShop({...body})
    }
}
