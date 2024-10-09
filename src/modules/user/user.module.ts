import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyToken, KeyTokenSchema, User, UserSchema } from 'src/schemas';
import { AuthService } from '../auth/auth.service';
import { HashingService } from '../hashing/hashing.service';
import { KeyTokenService } from '../key-token/key-token.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, HashingService, KeyTokenService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: KeyToken.name, schema: KeyTokenSchema },
    ]),
    
  ]
})
export class UserModule {}
