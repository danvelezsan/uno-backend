import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from '../player/player.entity';
import { Card } from '../card/card.entity';

@Entity()
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'integer' })
  public requiredPlayers: number;

  @Column({ type: 'boolean' })
  public started: boolean;

  @Column({ type: 'varchar' })
  public direction: string;

  @Column({ type: 'varchar', nullable: true })
  public actualColor: string;

  @Column({ type: 'varchar', nullable: true })
  public actualEffect: string;

  @Column({ type: 'integer', nullable: true })
  public winnerId: number;

  @OneToOne(() => Player)
  @JoinColumn({ name: 'winnerId', referencedColumnName: 'id' })
  public winner: Player;

  @Column({ type: 'integer', nullable: true })
  public turnPlayerId: number;

  @OneToOne(() => Player)
  @JoinColumn({ name: 'turnPlayerId', referencedColumnName: 'id' })
  public turnPlayer: Player;

  @OneToMany(() => Player, (player) => player.match)
  public players: Player[];

  @OneToMany(() => Card, (card) => card.match)
  public cards: Card[];
}
