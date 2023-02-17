/** @application */
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Player } from '../../player/player.entity';
import { Card } from '../../card/card.entity';

export class MatchDto {
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  readonly requiredPlayers: number;

  @Expose()
  readonly started: boolean;

  @Expose()
  readonly direction: string;

  @Expose()
  readonly actualColor: string;

  @Expose()
  readonly actualEffect: string;

  @Expose()
  public winnerId: number;

  @Expose()
  public winner: Player;

  @Expose()
  public turnPlayerId: number;

  @Expose()
  public turnPlayer: Player;

  @Expose()
  public players: Player[];

  @Expose()
  public cards: Card[];
}
