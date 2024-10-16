import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    versionKey: false,
    timestamps: true
})
export class User {
    
    @Prop()
    name: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User)