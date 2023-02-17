import { Controller, Inject } from '@nestjs/common';
import { CardService } from './card.service';

@Controller('card')
export class CardController {
  @Inject(CardService)
  private readonly service: CardService;
}
