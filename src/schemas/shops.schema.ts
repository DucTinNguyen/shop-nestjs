import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role, Status } from "src/common/enums";

export type ShopDocument = HydratedDocument<Shop>

@Schema({ collection: "shops", versionKey: false })
export class Shop {

    @Prop({ required: true })
    name: string

    @Prop({ unique: true, required: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ enum: Status, default: Status.Inactive})
    status: string // active, inactive

    @Prop({ default: false })
    verify: boolean

    @Prop({enum: Role})
    roles: Role
}

export const ShopSchema = SchemaFactory.createForClass(Shop)