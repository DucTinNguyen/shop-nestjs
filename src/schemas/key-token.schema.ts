import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

export type KeyTokenDocument = HydratedDocument<KeyToken>

@Schema({ collection: "key_items", versionKey: false, timestamps: true })
export class KeyToken {
    @Prop({ required: true })
    userId: string

    @Prop({ required: true })
    publicKey: string

    @Prop({ required: true })
    privateKey: string
    
    @Prop()
    refreshToken: string
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken)
