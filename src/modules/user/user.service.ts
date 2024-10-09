import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KeyToken, User } from 'src/schemas';
import { HashingService } from '../hashing/hashing.service';
import { KeyTokenService } from '../key-token/key-token.service';
import { MESSAGE_CODES } from 'src/common/constants';
import { generateKeyPairSync } from 'crypto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>,
        private readonly hashingService: HashingService,
        private readonly keyTokenService: KeyTokenService,
        private readonly authService: AuthService,
    ) { }
    
    async signUpUser(request: { name: string; email: string; password: string }) {
        const { name, email, password } = request

            const existUser = await this.userModel.findOne({ email }).lean()

            if (existUser) {
                throw new HttpException("User already exists", HttpStatus.BAD_REQUEST, {
                    cause: {
                        code: MESSAGE_CODES.ALREADY_EXIST
                    }
                })
            }

            try {
                const passwordHash = await this.hashingService.hashPassword(password)

                const newUser = new this.userModel({
                    name,
                    email,
                    password: passwordHash
                })

                const { publicKey, privateKey } = await generateKeyPairSync("rsa", {
                    modulusLength: 4096,
                    publicKeyEncoding: { type: "spki", format: "pem" },
                    privateKeyEncoding: { type: "pkcs8", format: "pem" }
                })
                
                const token = await this.authService.createTokenPairs(email, privateKey, publicKey, String(newUser._id))

                const publicKeyString = await this.keyTokenService.createKeyToken(String(newUser._id), publicKey, privateKey, String(token?.refreshToken))

                if (!publicKeyString) {
                    throw new HttpException("PublicKeyString error", HttpStatus.BAD_REQUEST, {
                        cause: {
                            code: MESSAGE_CODES.BAD_REQUEST
                        }
                    })
                }

                await newUser.save()

                return {
                    code: MESSAGE_CODES.SUCCESS,
                    data: {
                        accessToken: token?.accessToken,
                        refreshToken: token?.refreshToken
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



}
