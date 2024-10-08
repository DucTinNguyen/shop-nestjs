import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: 'RS256'
      },
    })
  ]
})
export class AuthModule {}
