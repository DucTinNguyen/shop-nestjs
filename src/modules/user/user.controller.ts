import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common';
import { SignUpUserDtoRequest } from './dtos';

@Controller('user')
@ApiTags("User")
@ApiBearerAuth()
export class UserController {

    constructor(
        private readonly userService: UserService,
    ){}

    @Post('sign-up')
    @Public()
    async signUpUser(@Body() body: SignUpUserDtoRequest) {
        await this.userService.signUpUser(body);
    }
}
