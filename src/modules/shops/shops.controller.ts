import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { ShopsService } from "./shops.service"
import { CreateShopDtoRequest } from "./dtos"
import { CurrentUser } from "src/common";
@Controller("shop")
@ApiTags("Shop")
@ApiBearerAuth()
export class ShopsController {
    constructor(private readonly shopService: ShopsService) { }
    

    @Get("")
    async getShopInformation(@CurrentUser("user") userId: string) {
        return this.shopService.getShopInformation({ userId });
    }
        
        
    @Post("")
    @HttpCode(200)
    async createShop(@CurrentUser("user") userId: string ,@Body() body: CreateShopDtoRequest) {
        return this.shopService.createShop({...body, userId});
    }


}
