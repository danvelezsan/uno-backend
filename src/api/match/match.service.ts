import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { CreatePlayerDto } from '../player/dto/create-player.dto';
import { DeletePlayerDto } from '../player/dto/delete-player.dto';
import { plainToClass } from 'class-transformer';
import { PlayerService } from '../player/player.service';
import { CardService } from '../card/card.service';

@Injectable()
export class MatchService {
  @InjectRepository(Match)
  private readonly repository: Repository<Match>;
  @Inject(PlayerService)
  private readonly playerService: PlayerService;
  @Inject(CardService)
  private readonly cardService: CardService;

  public async create(body: CreateMatchDto): Promise<Match | never> {
    const { userId, requiredPlayers }: CreateMatchDto = body;
    const newMatch = plainToClass(Match, {
      requiredPlayers,
      started: false,
      direction: 'right',
    });
    const match = await this.repository.save(newMatch);
    const createPlayerDto = plainToClass(CreatePlayerDto, {
      userId,
      match,
    });
    return this.addPlayer(createPlayerDto);
  }

  public async addPlayer(body: CreatePlayerDto): Promise<Match | never> {
    await this.playerService.create(body);
    return this.findOne(body.match.id);
  }

  public async removePlayer(body: DeletePlayerDto): Promise<Match | never> {
    await this.playerService.delete(body.playerId);
    if (body.match.players.length === 1) {
      await this.delete(body.match.id);
      const deletedMatch = body.match;
      deletedMatch.players = [];
      return plainToClass(Match, {
        deletedMatch,
      });
    } else {
      return this.findOne(body.match.id);
    }
  }

  public async startMatch(match: Match): Promise<Match> {
    let cardTypeIds = Array.from({ length: 108 }, (_, i) => i + 1);
    const shuffledCards = [];
    match.players.forEach(async (player) => {
      for (let i = 0; i < 7; i++) {
        const randomCard =
          cardTypeIds[Math.floor(Math.random() * cardTypeIds.length)];
        shuffledCards.push({
          visible: false,
          cardType: { id: randomCard },
          match: { id: match.id },
          player: { id: player.id },
        });
        cardTypeIds = cardTypeIds.filter((card) => card !== randomCard);
      }
    });
    while (cardTypeIds.length > 0) {
      const randomCard =
        cardTypeIds[Math.floor(Math.random() * cardTypeIds.length)];
      shuffledCards.push({
        visible: cardTypeIds.length === 1,
        cardType: { id: randomCard },
        match: { id: match.id },
        player: null,
      });
      cardTypeIds = cardTypeIds.filter((card) => card !== randomCard);
    }
    await this.cardService.createMany(shuffledCards);
    const cards = await this.cardService.findByMatch(match.id);
    match.players.forEach((player) => {
      player.cards = cards.filter((card) => card.playerId === player.id);
    });
    match.cards = cards.filter((card) => !card.playerId);
    const visibleCards = match.cards.filter((card) => card.visible);
    const firstVisibleCard = visibleCards[visibleCards.length - 1].cardType;
    if (firstVisibleCard.color === 'black') {
      const colors = ['blue', 'red', 'yellow', 'green'];
      match.actualColor = colors[Math.floor(Math.random() * colors.length)];
    } else {
      match.actualColor = firstVisibleCard.color;
    }
    match.started = true;
    match.turnPlayerId = match.players[0].id;
    await this.update(match.id, {
      started: match.started,
      actualColor: match.actualColor,
      turnPlayerId: match.turnPlayerId,
    });
    return match;
  }

  public async update(id: number, body: any): Promise<void> {
    await this.repository.update(id, body);
  }

  public async delete(body: number): Promise<void> {
    await this.repository.delete(body);
  }

  public async getAllNotStarted(): Promise<Match[] | never> {
    const matches: Match[] = await this.repository.find({
      where: { started: false },
    });
    for (const match of matches) {
      match.players = await this.playerService.findByMatch(match.id, false);
    }
    return matches;
  }

  public async findOne(id: number): Promise<Match | never> {
    const match: Match = await this.repository.findOne({
      where: { id },
    });
    match.players = await this.playerService.findByMatch(id, true);
    if (match.started) {
      const cards = await this.cardService.findByMatch(match.id);
      match.players.forEach((player) => {
        player.cards = cards.filter((card) => card.playerId === player.id);
      });
      match.cards = cards.filter((card) => !card.playerId);
    }
    return match;
  }
}
