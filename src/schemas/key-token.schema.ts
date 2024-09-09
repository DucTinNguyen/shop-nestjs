import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type KeyTokenDocument = HydratedDocument<KeyToken>

@Schema({ collection: "key_items", versionKey: false })
export class KeyToken {

    @Prop({ required: true })
    shopId: string

    @Prop({ required: true })
    publicKey: string

    @Prop({ required: true })
    privateKey: string

    @Prop({ default: [] })
    refreshTokensUsed: string[]

    @Prop({ default: [] })
    refreshToken: string
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken)