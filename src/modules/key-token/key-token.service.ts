import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeyToken, KeyTokenDocument } from 'src/schemas/key-token.schema';

@Injectable()
export class KeyTokenService {

    constructor(
        @InjectModel(KeyToken.name) private keyTokenModel: Model<KeyTokenDocument>
    ){}

    async createKeyToken(shopId: string, publicKey: string) {
        try {
            const publicKeyString = publicKey.toString();
            const token = await this.keyTokenModel.create({
                shopId: shopId,
                publicKey: publicKeyString
            })
            return token ? token.publicKey : null;
        } catch (e) { 
            console.log(e)
        }

    }
}
