import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


    constructor(
        private jwtService: JwtService
    ){}

    async createTokenPairs(email: string, privateKey: string) {
        try {

            const payload = {
                email
            }

            const accessToken = await this.jwtService.signAsync(payload, {
                algorithm: "RS256",
                expiresIn: "2 days",
                privateKey,
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
         }
        catch (e) {
            console.log("--error createTokenPairs", e);
        }
        
      
    }
}
