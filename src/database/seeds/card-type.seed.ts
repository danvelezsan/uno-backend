import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CardType } from '../../api/card-type/card-type.entity';

const colors = ['blue', 'red', 'yellow', 'green', 'black'];
const values = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+2',
  '+4',
  'changeColor',
  'reverse',
  'skip',
];

const getCardTypes = () => {
  const cardTypes = [];
  for (const color of colors) {
    for (const value of values) {
      if (color === 'black') {
        if (value === '+4' || value === 'changeColor') {
          cardTypes.push({
            value,
            color,
          });
          cardTypes.push({
            value,
            color,
          });
          cardTypes.push({
            value,
            color,
          });
          cardTypes.push({
            value,
            color,
          });
        }
      } else {
        if (value === '0') {
          cardTypes.push({
            value,
            color,
          });
        } else {
          if (value !== '+4' && value !== 'changeColor') {
            cardTypes.push({
              value,
              color,
            });
            cardTypes.push({
              value,
              color,
            });
          }
        }
      }
    }
  }
  return cardTypes;
};

export default class CardTypesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(CardType);
    const cardTypes = getCardTypes();
    await repository.insert(cardTypes);
  }
}
