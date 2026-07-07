import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { BlogModule } from './modules/blog/blog.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        NODE_ENV:            Joi.string().valid('development', 'staging', 'production').default('development'),
        PORT:                Joi.number().default(3000),
        DATABASE_URL:        Joi.string().required(),
        JWT_SECRET:          Joi.string().min(32).required(),
        JWT_EXPIRES_IN:      Joi.string().default('15m'),
        JWT_REFRESH_SECRET:  Joi.string().min(32).required(),
        JWT_REFRESH_EXPIRES: Joi.string().default('7d'),
        REDIS_URL:           Joi.string().optional().default('redis://localhost:6379'),
        FRONTEND_URL:        Joi.string().required(),
        AWS_REGION:          Joi.string().default('us-east-1'),
        AWS_ACCESS_KEY_ID:   Joi.string().optional(),
        AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
        AWS_S3_BUCKET:       Joi.string().optional(),
        STRIPE_SECRET_KEY:   Joi.string().optional(),
        STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
        MERCADOPAGO_ACCESS_TOKEN: Joi.string().optional(),
        WOMPI_PRIVATE_KEY:        Joi.string().optional(),
        WOMPI_PUBLIC_KEY:         Joi.string().optional(),
        WOMPI_INTEGRITY_SECRET:   Joi.string().optional(),
        BACKEND_PUBLIC_URL:       Joi.string().optional(),
        RESEND_API_KEY:      Joi.string().optional(),
        FIREBASE_PROJECT_ID: Joi.string().optional(),
        GOOGLE_CLIENT_ID:    Joi.string().optional(),
        GOOGLE_CLIENT_SECRET: Joi.string().optional(),
      }),
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'short',  ttl: 1000,  limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long',   ttl: 60000, limit: 200 },
    ]),

    // Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: config.get('REDIS_URL'),
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        },
      }),
      inject: [ConfigService],
    }),

    // Scheduler
    ScheduleModule.forRoot(),

    // Feature modules
    AuthModule,
    UsersModule,
    EventsModule,
    ArtistsModule,
    TicketsModule,
    PaymentsModule,
    BlogModule,
    NotificationsModule,
    AnalyticsModule,
    AdminModule,
    AffiliatesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
