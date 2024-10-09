import { Controller } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { ShopsService } from "./shops.service"

@Controller("shops")
@ApiTags("Shop")
@ApiBearerAuth()
export class ShopsController {
    constructor(private readonly shopService: ShopsService) {}
}
