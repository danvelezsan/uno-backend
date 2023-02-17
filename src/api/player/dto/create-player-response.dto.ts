/** @application */
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { MatchDto } from '../../match/dto/match.dto';

export class CreatePlayerResponserDto {
  @Expose()
  @IsNotEmpty()
  readonly playerId: number;

  @Expose()
  @IsNotEmpty()
  @Type(() => MatchDto)
  readonly match: MatchDto;
}
