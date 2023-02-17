import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CardService {
  @InjectRepository(Card)
  private readonly repository: Repository<Card>;

  public async create(body: CreateCardDto): Promise<Card | never> {
    const { visible, cardType, match, player }: CreateCardDto = body;
    const newCard = plainToClass(Card, {
      ...CreateCardDto,
      visible,
      cardType,
      match,
      player,
    });
    return this.repository.save(newCard);
  }

  public async update(id: number, body: any): Promise<void> {
    await this.repository.update(id, body);
  }

  public async findByMatch(matchId: number): Promise<Card[] | never> {
    return await this.repository.find({
      relations: { cardType: true },
      where: { match: { id: matchId } },
      order: {
        id: 'ASC',
      },
    });
  }

  public async createMany(body: CreateCardDto[]): Promise<void> {
    for (const card of body) {
      await this.create(card);
    }
  }

  public async updateMany(body: Card[]): Promise<void> {
    for (const card of body) {
      console.log(card);
      await this.update(card.id, {
        visible: card.visible,
        playerId: card.playerId,
      });
    }
  }
}
