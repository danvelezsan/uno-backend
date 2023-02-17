import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardType } from './card-type.entity';

@Injectable()
export class CardTypeService {
  @InjectRepository(CardType)
  private readonly repository: Repository<CardType>;

  public async getAllNotStarted(): Promise<CardType[] | never> {
    const matches: CardType[] = await this.repository.find();
    return matches;
  }
}
