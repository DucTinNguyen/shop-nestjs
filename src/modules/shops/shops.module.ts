import { Module } from '@nestjs/common';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from 'src/schemas';

@Module({
  controllers: [ShopsController],
  providers: [ShopsService],
  imports: [MongooseModule.forFeature([{name: Shop.name, schema: ShopSchema}])]
})
export class ShopsModule {}
