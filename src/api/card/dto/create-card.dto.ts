/** @application */
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { CardTypeDto } from '../../card-type/dto/card-type.dto';
import { MatchDto } from '../../match/dto/match.dto';
import { PlayerDto } from '../../player/dto/player.dto';

export class CreateCardDto {
  @Expose()
  @IsNotEmpty()
  readonly visible: boolean;

  @Expose()
  @IsNotEmpty()
  @Type(() => CardTypeDto)
  readonly cardType: CardTypeDto;

  @Expose()
  @IsNotEmpty()
  @Type(() => MatchDto)
  readonly match: MatchDto;

  @Expose()
  @IsNotEmpty()
  @Type(() => PlayerDto)
  readonly player: PlayerDto;
}
