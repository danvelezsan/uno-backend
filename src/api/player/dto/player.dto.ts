/** @application */
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../user/user.entity';
import { Match } from '../../match/match.entity';
import { Card } from '../../card/card.entity';

export class PlayerDto {
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  public user: User;

  @Expose()
  public match: Match;

  @Expose()
  public cards: Card[];
}
