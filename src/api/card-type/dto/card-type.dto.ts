/** @application */
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Card } from '../../card/card.entity';

export class CardTypeDto {
  @Expose()
  @IsNotEmpty()
  readonly id: number;

  @Expose()
  public value: string;

  @Expose()
  public color: string;

  @Expose()
  public cards: Card[];
}
