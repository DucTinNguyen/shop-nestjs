import { Controller, Get } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Controller("")
export class AppController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    start() {
        return {
            statusCode: 200,
            data: new Date().toISOString() + " - VERSION: " + this.configService.get<string>("VERSION")
        }
    }
}
