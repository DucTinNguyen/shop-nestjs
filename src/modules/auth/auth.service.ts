import { Injectable, Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
    ) { }
    private readonly logger = new Logger(AuthService.name)

    async createTokenPairs(email: string, privateKey: string, publicKey: string, shopId: string) {
        try {
            const payload = {
                email,
                publicKey,
                shopId
            }

            const accessToken = await this.jwtService.signAsync(payload, {
                algorithm: "RS256",
                expiresIn: "2 days",
                privateKey
            })

            const refreshToken = await this.jwtService.signAsync(payload, {
                algorithm: "RS256",
                expiresIn: "3 days",
                privateKey
            })
            return {
                accessToken,
                refreshToken
            }
        } catch (e) {
            console.log("--error createTokenPairs", e)
        }
    }

    // async signUpShop(request: { name: string; email: string; password: string; status?: string; verify?: boolean; roles?: string[] }) {
    //     const { name, email, password } = request

    //     const existShop = await this.shopModel.findOne({ email }).lean()

    //     if (existShop) {
    //         throw new HttpException("Shop already exists", HttpStatus.BAD_REQUEST, {
    //             cause: {
    //                 code: MESSAGE_CODES.ALREADY_EXIST
    //             }
    //         })
    //     }

    //     try {
    //         const passwordHash = await this.hashingService.hashPassword(password)

    //         const newShop = new this.shopModel({
    //             name,
    //             email,
    //             password: passwordHash,
    //             roles: Role.Shop
    //         })

    //         if (newShop) {
    //             const { publicKey, privateKey } = await generateKeyPairSync("rsa", {
    //                 modulusLength: 4096,
    //                 publicKeyEncoding: { type: "spki", format: "pem" },
    //                 privateKeyEncoding: { type: "pkcs8", format: "pem" }
    //             })
    //             const token = await this.createTokenPairs(email, privateKey, publicKey, String(newShop._id))

    //             const publicKeyString = await this.keyTokenService.createKeyToken(String(newShop._id), publicKey, privateKey, String(token?.refreshToken))

    //             if (!publicKeyString) {
    //                 throw new HttpException("PublicKeyString error", HttpStatus.BAD_REQUEST, {
    //                     cause: {
    //                         code: MESSAGE_CODES.BAD_REQUEST
    //                     }
    //                 })
    //             }

    //             await newShop.save()

    //             return {
    //                 code: MESSAGE_CODES.SUCCESS,
    //                 data: {
    //                     accessToken: token?.accessToken,
    //                     refreshToken: token?.refreshToken
    //                 }
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, {
    //             cause: {
    //                 code: MESSAGE_CODES.INTERNAL_SERVER_ERROR
    //             }
    //         })
    //     }
    // }

    // async signInShop(request: { email: string; password: string }) {
    //     const { email, password } = request

    //     const shopExist = await this.shopModel.findOne({ email }).lean()
    //     if (!shopExist) {
    //         throw new HttpException("Shop not found", HttpStatus.BAD_REQUEST, { cause: { code: MESSAGE_CODES.BAD_REQUEST } })
    //     }

    //     const isCorrectPassword = await this.hashingService.comparePassword(password, shopExist.password)
    //     if (!isCorrectPassword) {
    //         throw new HttpException("Password is incorrect", HttpStatus.BAD_REQUEST, { cause: { code: MESSAGE_CODES.PASSWORD_INCORRECT } })
    //     }
    //     //1. Create new key pair
    //     const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    //         modulusLength: 4096,
    //         publicKeyEncoding: { type: "spki", format: "pem" },
    //         privateKeyEncoding: { type: "pkcs8", format: "pem" }
    //     })
    //     //2. create token based on privatekey
    //     const token = await this.createTokenPairs(email, privateKey, publicKey, String(shopExist._id))
    //     //3. Save DB
    //     const publicKeyString = await this.keyTokenService.createKeyToken(String(shopExist._id), publicKey, privateKey, String(token?.refreshToken))

    //     if (!publicKeyString) {
    //         throw new HttpException("PublicKeyString error", HttpStatus.BAD_REQUEST, {
    //             cause: {
    //                 code: MESSAGE_CODES.BAD_REQUEST
    //             }
    //         })
    //     }
    //     return {
    //         code: MESSAGE_CODES.SUCCESS,
    //         data: {
    //             accessToken: token?.accessToken,
    //             refreshToken: token?.refreshToken
    //         }
    //     }
    // }

    // async logoutShop(request: { shopId: string }) {
    //     const { shopId } = request
    //     try {

    //         await this.keyTokenModel.findOneAndUpdate({ shopId }, { refreshToken: "", publicKey: "", privateKey: "" }, { new: true })
    //         return {
    //             code: MESSAGE_CODES.SUCCESS
    //         }

    //     } catch (e) {
    //         this.logger.debug(`Error logging out`, e)
    //         throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, {
    //             cause: {
    //                 code: MESSAGE_CODES.INTERNAL_SERVER_ERROR
    //             }
    //         })
    //     }
    // }

    // async refreshToken(request: { refreshToken: string, shopId: string }) {
    //     const { refreshToken , shopId} = request 
    //     const shopItemKey = await this.keyTokenModel.findOne({ refreshToken, shopId })
    //     const shopItem = await this.shopModel.findById(shopId)
    //     if (!shopItemKey || !shopItem) {
    //         throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED, {
    //             cause: {
    //                 code: MESSAGE_CODES.BAD_REQUEST
    //             }
    //         })
    //     }
    //     try {
    //         //1. Create new key pair
    //         const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    //             modulusLength: 4096,
    //             publicKeyEncoding: { type: "spki", format: "pem" },
    //             privateKeyEncoding: { type: "pkcs8", format: "pem" }
    //         })
    //         //2. create token based on privatekey
    //         const token = await this.createTokenPairs(shopItem.email, privateKey, publicKey, String(shopId))
    //         //3. Save DB
    //         await this.keyTokenService.createKeyToken(shopId, publicKey, privateKey, String(token?.refreshToken))

    //         return {
    //             code: MESSAGE_CODES.SUCCESS,
    //             data: {
    //                 accessToken: token?.accessToken,
    //                 refreshToken: token?.refreshToken
    //             }
    //         }
    //     } catch (err) {
    //         this.logger.error("Refresh token is handle error")
    //         throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR, {
    //             cause: {
    //                 code: MESSAGE_CODES.INTERNAL_SERVER_ERROR
    //             }
    //         })
    //     }



    // }
}
