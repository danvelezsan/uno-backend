import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Match } from '../match/match.entity';
import { Player } from '../player/player.entity';
import { CardType } from '../card-type/card-type.entity';

@Entity()
@Unique(['cardType', 'match'])
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'boolean' })
  public visible: boolean;

  @ManyToOne(() => CardType, (cardType) => cardType.id)
  public cardType: CardType;

  @ManyToOne(() => Match, (match) => match.id)
  public match: Match;

  @Column({ type: 'integer', nullable: true })
  public playerId: number;

  @ManyToOne(() => Player, (player) => player.id)
  @JoinColumn({ name: 'playerId', referencedColumnName: 'id' })
  public player: Player;
}
