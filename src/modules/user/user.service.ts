import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { generateKeyPairSync } from 'crypto';
import { Model } from 'mongoose';
import { MESSAGE_CODES } from 'src/common/constants';
import { ResponseType } from 'src/common/dtos';
import { KeyToken, User } from 'src/schemas';
import { AuthService } from '../auth/auth.service';
import { HashingService } from '../hashing/hashing.service';
import { KeyTokenService } from '../key-token/key-token.service';
import { TokenDtoResponse } from './dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(KeyToken.name) private keyTokenModel: Model<KeyToken>,
        private readonly hashingService: HashingService,
        private readonly keyTokenService: KeyTokenService,
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) { }
    
    async signUpUser(request: { name: string; email: string; password: string }): Promise<ResponseType<TokenDtoResponse>> {
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

                if (!token) {
                    throw new HttpException("Token error", HttpStatus.BAD_REQUEST, {
                        cause: {
                            code: MESSAGE_CODES.BAD_REQUEST
                        }
                    })
                }

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
                        accessToken: token.accessToken,
                        refreshToken: token.refreshToken
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

    async signInUser(request: { email: string, password: string }): Promise<ResponseType<TokenDtoResponse>> {

        const {email, password} = request

        const user = await this.userModel.findOne({ email }).lean()

        if (!user) {
            throw new HttpException("User not found", HttpStatus.BAD_REQUEST, { cause: { code: MESSAGE_CODES.BAD_REQUEST } })
        }

        const isCorrectPassword = await this.hashingService.comparePassword(password, user.password)

        if (!isCorrectPassword) { 
            throw new HttpException("Password is incorrect", HttpStatus.BAD_REQUEST, { cause: { code: MESSAGE_CODES.PASSWORD_INCORRECT } })
        }

        try {
            
            const { publicKey, privateKey } = generateKeyPairSync("rsa", {
                modulusLength: 4096,
                publicKeyEncoding: { type: "spki", format: "pem" },
                privateKeyEncoding: { type: "pkcs8", format: "pem" }
            })

            const token = await this.authService.createTokenPairs(email, privateKey, publicKey, String(user._id))

            if (!token) {
                throw new HttpException("Token error", HttpStatus.BAD_REQUEST, {
                    cause: {
                        code: MESSAGE_CODES.BAD_REQUEST
                    }
                })
            }

            await this.keyTokenService.createKeyToken(String(user._id), publicKey, privateKey, String(token?.refreshToken))

            return {
                code: MESSAGE_CODES.SUCCESS,
                data: {
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken
                }
            }


        } catch (err) { 
            console.log(err)
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, { cause: { code: MESSAGE_CODES.INTERNAL_SERVER_ERROR } })
        }

    }

    async signOut(request: { userId: string }): Promise<ResponseType<{code: string}>> {
        const { userId } = request

        try {
            await this.keyTokenModel.findOneAndUpdate({ userId }, { refreshToken: "" }, { new: true })
            
            return {
                code: MESSAGE_CODES.SUCCESS,
            }

        } catch (err) { 
            console.log(err)
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, { cause: { code: MESSAGE_CODES.INTERNAL_SERVER_ERROR } })
        }
    }

    async refreshToken(request: { refreshToken: string }): Promise<ResponseType<TokenDtoResponse>> {
        
        const { refreshToken } = request
        
        const { userId } = await this.jwtService.decode(refreshToken)
        const keyItem = await this.keyTokenModel.findOne({ userId })
        
        if (!keyItem) {
            throw new HttpException("Refresh token not found", HttpStatus.BAD_REQUEST, { cause: { code: `refresh_token_${MESSAGE_CODES.INVALID}`} })
        }
        const user = await this.userModel.findById(userId).lean()
        if (!user) {
            throw new HttpException("User not found", HttpStatus.BAD_REQUEST, { cause: { code: `user_${MESSAGE_CODES.NOT_FOUND}` } })
        }

        try {

            const { publicKey, privateKey } = generateKeyPairSync("rsa", {
                modulusLength: 4096,
                publicKeyEncoding: { type: "spki", format: "pem" },
                privateKeyEncoding: { type: "pkcs8", format: "pem" }
            })

            const token = await this.authService.createTokenPairs(user.email, privateKey, publicKey, userId)

            if (!token) {
                throw new HttpException("Token error", HttpStatus.BAD_REQUEST, {
                    cause: {
                        code: MESSAGE_CODES.BAD_REQUEST
                    }
                })
            }

            await this.keyTokenService.createKeyToken(userId, publicKey, privateKey, token.refreshToken)

            return {
                code: MESSAGE_CODES.SUCCESS,
                data: {
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken
                }
            }


        } catch (err) { 
            console.log(err)
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, { cause: { code: MESSAGE_CODES.INTERNAL_SERVER_ERROR } })
        }
    }
}
