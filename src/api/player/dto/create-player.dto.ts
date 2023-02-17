/** @application */
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { MatchDto } from '../../match/dto/match.dto';

export class CreatePlayerDto {
  @Expose()
  @IsNotEmpty()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  @Type(() => MatchDto)
  readonly match: MatchDto;
}
