/** @application */
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateMatchDto {
  @Expose()
  @IsNotEmpty()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  readonly requiredPlayers: number;
}
