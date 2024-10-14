import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type ProductDocument = HydratedDocument<Product>


@Schema({
    versionKey: false,
    timestamps: true
})
export class Product {

    @Prop()
    name: string

    @Prop()
    imageUrl: string

    @Prop()
    description: string

    @Prop()
    price: number

    @Prop()
    category: string

    @Prop()
    stock: number

    @Prop()
    rating: number

}


export const ProductSchema = SchemaFactory.createForClass(Product)