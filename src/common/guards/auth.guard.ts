import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { AuthRepository } from "src/modules/auth/auth.repository"
import { MESSAGE_CODES } from "../constants"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator"
import { ROLES_KEY } from "../decorators/roles.decorators"
import { Role } from "../enums"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private readonly configService: ConfigService, 
        private readonly authRepository: AuthRepository
    ) {} 

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

        if (isPublic) {
            return true
        }

        const { token } = this.extractCredentialFromHeader(request)
        
        if (!token) {
            throw new HttpException("unauthorized", HttpStatus.UNAUTHORIZED, {
                cause: {
                    code: MESSAGE_CODES.UNAUTHORIZED
                }
            })
        }

        const { publicKey, userId } = await this.jwtService.decode(token)
        const keyTokenItem = await this.authRepository.getUserKeyItem(userId)

        if (!keyTokenItem || !keyTokenItem.refreshToken) {
            throw new HttpException("unauthorized", HttpStatus.UNAUTHORIZED, {
                cause: {
                    code: MESSAGE_CODES.UNAUTHORIZED
                }
            })
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                publicKey,
                algorithms: ["RS256"]
            })
            request["userId"] = payload.userId

        } catch (error: any) {
            console.log("---error", error)
            throw new HttpException("unauthorized", HttpStatus.UNAUTHORIZED, {
                cause: {
                    code: MESSAGE_CODES.UNAUTHORIZED
                }
            })
        }

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
        if (!requiredRoles) {
            return true
        }

        const hasRoles = requiredRoles.some((role) => request.roles?.includes(role))

        if (!hasRoles) {
            throw new HttpException("unauthorized", HttpStatus.UNAUTHORIZED, {
                cause: {
                    code: `role_${MESSAGE_CODES.UNAUTHORIZED}`
                }
            })
        }

        return true
    }

    private extractCredentialFromHeader(request: any): { token: string; publicKey: string } {
        const token = request.headers["authorization"].split(" ")[1]
        const publicKey = request.headers["x-public-key"]
        return {
            token,
            publicKey
        }
    }
}
