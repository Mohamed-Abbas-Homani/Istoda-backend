import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from '../config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
  namingStrategy: new SnakeNamingStrategy(),
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: config.database.logging,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: config.database.max,
    ssl: config.database.ssl
      ? {
          rejectUnauthorized: config.database.rejectUnauthorized,
          ca: config.database.ca,
          key: config.database.key,
          cert: config.database.cert,
        }
      : undefined,
  },
} as DataSourceOptions);
