import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardType } from './card-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardType])],
  controllers: [],
  providers: [],
  exports: [],
})
export class CardTypeModule {}
