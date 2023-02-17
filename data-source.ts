import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

dotenv.config({ path: 'src/common/envs/development.env' });

const options: DataSourceOptions & SeederOptions = {
  name: 'seeds',
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: ['src/**/**/*.entity{.ts,.js}'],
  seeds: ['src/database/seeds/*.seed{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'typeorm_migrations',
};

export const dataSource = new DataSource(options);
