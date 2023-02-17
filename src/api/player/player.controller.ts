import { Controller, Inject } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  @Inject(PlayerService)
  private readonly service: PlayerService;
}
