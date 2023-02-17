import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UserService } from '../user/user.service';
import { plainToClass } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PlayerService {
  @InjectRepository(Player)
  private readonly repository: Repository<Player>;
  @Inject(UserService)
  private readonly userService: UserService;

  public async create(body: CreatePlayerDto): Promise<Player | never> {
    const { userId, match }: CreatePlayerDto = body;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const players = await this.findByMatch(match.id, true);
    const userInMatch = players.find((player) => player.user.id === userId);
    if (userInMatch) {
      throw new NotFoundException('User already in match');
    }
    const newPlayer = plainToClass(Player, {
      ...CreatePlayerDto,
      user,
      match,
    });
    return this.repository.save(newPlayer);
  }

  public async delete(body: any): Promise<void> {
    await this.repository.delete(body);
  }

  public async findByMatch(
    matchId: number,
    getUser: boolean,
  ): Promise<Player[] | never> {
    return await this.repository.find({
      relations: { user: getUser },
      where: { match: { id: matchId } },
      order: {
        id: 'ASC',
      },
    });
  }
}
