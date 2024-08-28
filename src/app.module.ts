import { ControllerInjector, GuardInjector, OpenTelemetryModule, PipeInjector } from "@amplication/opentelemetry-nestjs"
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerModule } from "@nestjs/throttler"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { WinstonModule } from "nest-winston"
import { join } from 'path'
import { AppController } from "./app.controller"
import { LoggerMiddleware, RequestTimeoutInterceptor, ThrottlerBehindProxyGuard, TransformInterceptor, ValidationPipe } from "./common"
import { AllExceptionsFilter } from "./common/exceptions"
import { validate } from "./common/validations/env.validation"
import { configurations } from "./configs/config"
import { WinstonConfigService } from "./configs/winston"
import { MonitorModule, MonitorService } from "./modules/monitor"

require("dotenv").config()
@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
          }),
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
        OpenTelemetryModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                serviceName: configService.get<string>("SERVICE_NAME")!,
                autoDetectResources: true,
                traceAutoInjectors: [PipeInjector, GuardInjector, ControllerInjector],
                spanProcessor: new BatchSpanProcessor(
                    new OTLPTraceExporter({
                        url: configService.get<string>("TRACE_EXPORTER_URL")!
                    })
                )
            })
        })
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerBehindProxyGuard
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
