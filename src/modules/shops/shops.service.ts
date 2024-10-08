import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGE_CODES } from 'src/common/constants';
import { Shop } from 'src/schemas';
import { HashingService } from '../hashing/hashing.service';
import { Role } from 'src/common/enums';
import { generateKeyPairSync } from 'crypto';
import { KeyTokenService } from '../key-token/key-token.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ShopsService {
    constructor(
        @InjectModel(Shop.name) private shopModel: Model<Shop>,
        private readonly hashingService: HashingService,
        private readonly keyTokenService: KeyTokenService,
        private readonly authService: AuthService
    ) { }
    

    async signUpShop(request: { name: string, email: string, password: string, status?: string, verify?: boolean, roles?: string[] }) {
        const { name, email, password } = request

        const existShop = await this.shopModel.findOne({ email }).lean()

        if (existShop) {
            throw new HttpException("Shop already exists", HttpStatus.BAD_REQUEST, {
                cause: {
                    code: MESSAGE_CODES.ALREADY_EXIST
                }
            })
        }

        try {

            const passwordHash = await this.hashingService.hashPassword(password)
            
            const newShop = new this.shopModel({
                name,
                email,
                password: passwordHash,
                roles: Role.Shop
            })

            if (newShop) {
                const { publicKey, privateKey } = await generateKeyPairSync("rsa", {
                    modulusLength: 4096,
                    publicKeyEncoding: { type: "spki", format: "pem" },
                    privateKeyEncoding: { type: "pkcs8", format: "pem" },
                })
                const token = await this.authService.createTokenPairs(email, privateKey)

                const publicKeyString = await this.keyTokenService.createKeyToken(String(newShop._id), publicKey, privateKey, String(token?.refreshToken))

                if (!publicKeyString) {
                    throw new HttpException("PublicKeyString error", HttpStatus.BAD_REQUEST, {
                        cause: {
                            code: MESSAGE_CODES.BAD_REQUEST
                        }
                    })
                }
                
                
                await newShop.save()

                return {
                    code: MESSAGE_CODES.SUCCESS,
                    data: {
                        accessToken: token?.accessToken,
                        refreshToken: token?.refreshToken
                    }
                }
            }
        } catch (err) { 
            console.log(err)
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: {
                    code: MESSAGE_CODES.INTERNAL_SERVER_ERROR
                }
            })
        }
    }

    async signInShop(request: {email: string, password: string}) {
        const { email, password } = request
        
        const shopExist = await this.shopModel.findOne({ email }).lean()
        if (!shopExist) { 
            throw new HttpException("Shop not found", HttpStatus.BAD_REQUEST,{cause: {code: MESSAGE_CODES.BAD_REQUEST}})
        }
        
        const isCorrectPassword = await this.hashingService.comparePassword(password, shopExist.password)
        if (!isCorrectPassword) {
            throw new HttpException("Password is incorrect", HttpStatus.BAD_REQUEST, { cause: { code: MESSAGE_CODES.PASSWORD_INCORRECT } })
        }
        //1. Create new key pair
        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
        })
        //2. create token based on privatekey
        const token = await this.authService.createTokenPairs(email, privateKey)
        //3. Save DB
        const publicKeyString = await this.keyTokenService.createKeyToken(String(shopExist._id), publicKey, privateKey, String(token?.refreshToken))

        if (!publicKeyString) {
            throw new HttpException("PublicKeyString error", HttpStatus.BAD_REQUEST, {
                cause: {
                    code: MESSAGE_CODES.BAD_REQUEST
                }
            })
        }
        return {
            code: MESSAGE_CODES.SUCCESS,
            data: {
                accessToken: token?.accessToken,
                refreshToken: token?.refreshToken
            }
        }
    }
    
    async logoutShop() {
        return "Logout shop"
    }
}
