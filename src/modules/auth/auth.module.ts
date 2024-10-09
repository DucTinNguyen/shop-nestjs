import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { AuthRepository } from "./auth.repository"
import { MongooseModule } from "@nestjs/mongoose"
import { KeyToken, KeyTokenSchema, Shop, ShopSchema } from "src/schemas"
import { AuthController } from './auth.controller';
import { HashingModule } from "../hashing/hashing.module"
import { KeyTokenModule } from "../key-token/key-token.module"

@Module({
    providers: [AuthService, AuthRepository],
    exports: [AuthRepository, AuthService],
    imports: [
        JwtModule.register({
            global: true,
            signOptions: {
                algorithm: "RS256"
            }
        }),
        MongooseModule.forFeature(
            [
                { name: Shop.name, schema: ShopSchema },
                { name: KeyToken.name, schema: KeyTokenSchema }
            ]
        ),
        HashingModule, KeyTokenModule
    ],
    controllers: [AuthController]
})
export class AuthModule {}
