import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { MongooseModule } from "@nestjs/mongoose"
import { ServeStaticModule } from "@nestjs/serve-static"
import { ThrottlerModule } from "@nestjs/throttler"
import { WinstonModule } from "nest-winston"
import { join } from "path"
import { AppController } from "./app.controller"
import { AuthGuard, LoggerMiddleware, RequestTimeoutInterceptor, TransformInterceptor, ValidationPipe } from "./common"
import { AllExceptionsFilter } from "./common/exceptions"
import { validate } from "./common/validations/env.validation"
import { configurations } from "./configs/config"
import { WinstonConfigService } from "./configs/winston"
import { AuthModule, ShopsModule, UserModule } from "./modules"
import { MonitorModule, MonitorService } from "./modules/monitor"

require("dotenv").config()

const modules = [ShopsModule, AuthModule, UserModule]
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public")
        }),
        MongooseModule.forRoot("mongodb+srv://shop-product:ndt20011@cluster0.gcjskbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"),
        ConfigModule.forRoot({
            load: configurations,
            envFilePath: "./.env",
            isGlobal: true,
            validate: validate
        }),
        WinstonModule.forRootAsync({
            useFactory: (configService: ConfigService, monitorService: MonitorService) => new WinstonConfigService(configService, monitorService).createWinstonModuleOptions(),
            imports: [ConfigModule, MonitorModule],
            inject: [ConfigService, MonitorService]
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 100
            }
        ]),
        ...modules
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useFactory: (configService: ConfigService) => {
                return new RequestTimeoutInterceptor(configService)
            },
            inject: [ConfigService]
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter
        }
    ]
})
export class AppModule implements NestModule {
    async configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("*")
    }
}
