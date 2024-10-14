import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from 'src/common';
import { RefreshTokenDtoRequest, SignInUserDtoRequest, SignUpUserDtoRequest } from './dtos';
import { ResponseType } from 'src/common/dtos';

@Controller('user')
@ApiTags("User")
@ApiBearerAuth()
export class UserController {

    constructor(
        private readonly userService: UserService,
    ){}

    @Post('sign-up')
    @Public()
    @HttpCode(200)
    async signUpUser(@Body() body: SignUpUserDtoRequest): Promise<ResponseType> {
        return this.userService.signUpUser(body);
    }

    @Post("sign-in")
    @Public()
    @HttpCode(200)
    async signInUser(@Body() body: SignInUserDtoRequest): Promise<ResponseType> {
        return this.userService.signInUser(body);
    }

    @Post("sign-out")
    @HttpCode(200)
    async signOutUser(@CurrentUser("user") userId: string): Promise<ResponseType> {
        return this.userService.signOut({userId})
    }

    @Post("refresh-token")
    @Public()
    @HttpCode(200)
    async refreshToken(@Body() body: RefreshTokenDtoRequest): Promise<ResponseType>{
        return this.userService.refreshToken(body)
    }

}
