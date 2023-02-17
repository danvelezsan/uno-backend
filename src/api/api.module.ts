import { CardTypeModule } from './card-type/card-type.module';
import { MatchModule } from './match/match.module';
import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, MatchModule, PlayerModule, CardTypeModule],
})
export class ApiModule {}
