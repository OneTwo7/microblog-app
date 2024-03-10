import { config as dotEnvConfig } from 'dotenv-safe';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from './entities/User';

dotEnvConfig({
  example: '.env',
});

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: false,
  entities: [User],
  migrations: [path.join(__dirname, './migrations/*')],
});
