import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags("Auth")
@ApiBearerAuth()
export class AuthController {
    
    constructor(
        private readonly authService: AuthService
    ){}


    // @Public()
    // @Post("/sign-up")
    // @HttpCode(HttpStatus.OK)
    // async signUpShop(@Body() body: SignUpShopRequestDto) {
    //     return this.authService.signUpShop({ ...body })
    // }

    // @Public()
    // @Post("/sign-in")
    // @HttpCode(HttpStatus.OK)
    // async signInShop(@Body() body: SignInShopRequestDto) {
    //     return this.authService.signInShop({ ...body })
    // }

    // @Post("/logout")
    // @HttpCode(HttpStatus.OK)
    // async logoutShop(@CurrentShop() shopId: string) {
    //     return this.authService.logoutShop({ shopId })
    // }

    // @Post("refresh-token")
    // @HttpCode(HttpStatus.OK)
    // async refreshToken(@Body() body: RefreshTokenDto, @CurrentShop() shopId: string) { 
    //     return this.authService.refreshToken({...body, shopId})
    // }
}
