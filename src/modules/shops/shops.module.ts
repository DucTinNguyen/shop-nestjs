import { Module } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { MongooseModule } from "@nestjs/mongoose"
import { KeyToken, KeyTokenSchema, Shop, ShopSchema } from "src/schemas"
import { AuthModule } from "../auth/auth.module"
import { HashingModule } from "../hashing/hashing.module"
import { KeyTokenModule } from "../key-token/key-token.module"
import { ShopsController } from "./shops.controller"
import { ShopsService } from "./shops.service"

@Module({
    controllers: [ShopsController],
    providers: [ShopsService, JwtService],
    imports: [
        MongooseModule.forFeature(
            [
                { name: Shop.name, schema: ShopSchema },
                { name: KeyToken.name, schema: KeyTokenSchema }
            ]
        ),
        HashingModule, KeyTokenModule, AuthModule]
})
export class ShopsModule {}
