import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Card } from '../card/card.entity';

@Entity()
export class CardType extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public value: string;

  @Column({ type: 'varchar' })
  public color: string;

  @OneToMany(() => Card, (card) => card.cardType)
  public cards: Card[];
}
