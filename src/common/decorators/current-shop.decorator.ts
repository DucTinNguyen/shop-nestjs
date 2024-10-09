import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const CurrentShop = createParamDecorator<string>((prop: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const shop = request["shopId"]

    if (!shop) {
        return null
    }

    return shop
})
