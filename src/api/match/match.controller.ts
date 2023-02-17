import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { CreatePlayerDto } from '../player/dto/create-player.dto';
import { Match } from './match.entity';

@Controller('match')
export class MatchController {
  @Inject(MatchService)
  private readonly service: MatchService;

  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  private create(@Body() body: CreateMatchDto): Promise<Match | never> {
    return this.service.create(body);
  }

  @Post('add-player')
  @UseInterceptors(ClassSerializerInterceptor)
  private addPlayer(@Body() body: CreatePlayerDto): Promise<Match | never> {
    return this.service.addPlayer(body);
  }

  @Get('not-started')
  @UseInterceptors(ClassSerializerInterceptor)
  private getAllNotStarted(): Promise<Match[] | never> {
    return this.service.getAllNotStarted();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  private findOne(@Param('id') id: number): Promise<Match | never> {
    return this.service.findOne(id);
  }
}
