import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.get<string>('DATABASE_URL'),
  ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: config.get('NODE_ENV') === 'development',
  logging: config.get('NODE_ENV') === 'development' ? ['query', 'error'] : ['error'],
  migrationsRun: config.get('NODE_ENV') === 'production',
  extra: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});
