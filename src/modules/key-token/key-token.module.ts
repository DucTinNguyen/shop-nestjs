import { Module } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyToken, KeyTokenSchema } from 'src/schemas/key-token.schema';

@Module({
  providers: [KeyTokenService],
  imports: [
    MongooseModule.forFeature([{name: KeyToken.name, schema: KeyTokenSchema}])
  ],
  exports: [KeyTokenService]
})
export class KeyTokenModule {}
