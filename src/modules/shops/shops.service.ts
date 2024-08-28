import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGE_CODES } from 'src/common/constants';
import { Role } from 'src/common/enums';
import { Shop } from 'src/schemas';

@Injectable()
export class ShopsService {
    constructor(
        @InjectModel(Shop.name) private shopModel: Model<Shop>
    ) { }
    

    async signUpShop(request: {name: string, email: string, password: string, status?: string, verify?:boolean, roles?: Role}) {
        const { name, email, password, status, verify, roles } = request

        const existShop = await this.shopModel.findOne({ email }).lean()
        if (existShop) {
            throw new HttpException("Shop already exists", HttpStatus.BAD_REQUEST, {
                cause: {
                    code: MESSAGE_CODES.ALREADY_EXIST
                }
            })
        }

        try {
            
            const newShop = new this.shopModel({
                name,
                email,
                password
            })

            await newShop.save()

        } catch (err) { 
            console.log(err)
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: {
                    code: MESSAGE_CODES.INTERNAL_SERVER_ERROR
                }
            })
        }
    }
    
}
