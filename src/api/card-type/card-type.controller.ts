import { Controller, Inject } from '@nestjs/common';
import { CardTypeService } from './card-type.service';

@Controller('card-type')
export class CardTypeController {
  @Inject(CardTypeService)
  private readonly service: CardTypeService;
}
