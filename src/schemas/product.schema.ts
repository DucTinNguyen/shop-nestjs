import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ProductCategory } from "src/common/enums";


export type ProductDocument = HydratedDocument<Product>


@Schema({
    versionKey: true,
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

    @Prop({enum: ProductCategory})
    category: ProductCategory

    @Prop()
    stock: number

    @Prop()
    sold: number

    @Prop({default: 0})
    rating: number

}


export const ProductSchema = SchemaFactory.createForClass(Product)