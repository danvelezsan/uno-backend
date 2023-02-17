import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Match } from '../match/match.entity';
import { Card } from '../card/card.entity';

@Entity()
@Unique(['user', 'match'])
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.id)
  public user: User;

  @ManyToOne(() => Match, (match) => match.id)
  public match: Match;

  @OneToMany(() => Card, (card) => card.player)
  public cards: Card[];
}
