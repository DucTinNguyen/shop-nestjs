import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { KeyToken } from "src/schemas";

@Injectable()
export class AuthRepository {

    constructor(
        @InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>
    ){}

    async getUserKeyItem(userId: string) {
        return await this.keyTokenModel.findById(userId)
    }
}