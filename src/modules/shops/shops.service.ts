import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MESSAGE_CODES } from "src/common/constants";
import { Status } from "src/common/enums";
import { Shop, ShopDocument } from "src/schemas";

@Injectable()
export class ShopsService {
    constructor(
       @InjectModel(Shop.name) private shopModel: Model<ShopDocument>
    ) {}

    private logger = new Logger(ShopsService.name)


    async getShopInformation(request: { userId: string }) {
        
        const { userId } = request

        const shop = await this.shopModel.find({ userId }).lean()

        return {
            code: MESSAGE_CODES.SUCCESS,
            data: shop
        }
    }

    async createShop(request: { userId: string; name: string; email: string }){
        const { userId, name , email} = request
        
        const shopExist = await this.shopModel.findOne({ email }).lean()
        
        if (shopExist) {
            throw new HttpException("Shop already exists", HttpStatus.BAD_REQUEST, { cause: { code: MESSAGE_CODES.ALREADY_EXIST } })
        }

        try {

            const newShop = new this.shopModel({ userId, name, email, status: Status.Active, verify: false })
            const result = await newShop.save()
            return {
                code: MESSAGE_CODES.SUCCESS,
                data: result
            }
        } catch (err) {
            this.logger.error("Create shop handle error")
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, { cause: { code: MESSAGE_CODES.INTERNAL_SERVER_ERROR } })
        }
    }
}
