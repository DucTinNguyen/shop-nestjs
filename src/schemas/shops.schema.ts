import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { Status } from "src/common/enums"

export type ShopDocument = HydratedDocument<Shop>

@Schema({ collection: "shops", versionKey: false, timestamps: true })
export class Shop {

    @Prop()
    userId: string
        
    @Prop({ required: true })
    name: string

    @Prop({required: true })
    email: string

    @Prop({ enum: Status, default: Status.Active })
    status: Status // active, inactive

    @Prop({ default: false })
    verify: boolean
}

export const ShopSchema = SchemaFactory.createForClass(Shop)
