import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { KeyToken, KeyTokenDocument } from "src/schemas/key-token.schema"

@Injectable()
export class KeyTokenService {
    constructor(@InjectModel(KeyToken.name) private keyTokenModel: Model<KeyTokenDocument>) {}

    async createKeyToken(userId: string, publicKey: string, privateKey: string, refreshToken: string) {
        try {
            const res = await this.keyTokenModel.findOneAndUpdate({ userId}, { publicKey, privateKey, refreshToken }, { new: true, upsert: true })

            return res ? res.publicKey : null
        } catch (e) {
            console.log(e)
        }
    }
}
