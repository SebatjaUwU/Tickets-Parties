import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:4200');

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", frontendUrl],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  app.use(compression());

  // CORS
  app.enableCors({
    origin: [frontendUrl, /\.fantribute\.com$/],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Skip-Loading'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('v1');

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // Global filters & interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger
  if (config.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('FAN TRIBUTE API')
      .setDescription('API para la plataforma EDM FAN TRIBUTE')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Autenticación')
      .addTag('users', 'Usuarios')
      .addTag('events', 'Eventos')
      .addTag('artists', 'Artistas')
      .addTag('tickets', 'Entradas')
      .addTag('orders', 'Órdenes')
      .addTag('payments', 'Pagos')
      .addTag('blog', 'Blog y noticias')
      .addTag('analytics', 'Analítica')
      .addTag('admin', 'Administración')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
    logger.log(`Swagger docs: http://localhost:${port}/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 FAN TRIBUTE API running on port ${port}`);
  logger.log(`📖 Environment: ${config.get('NODE_ENV')}`);
}

bootstrap();
