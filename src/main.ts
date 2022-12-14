import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './application/app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // ConfigModule.forRoot({isGlobal: true})
  // await app.init()
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
  });
  const SERVER_PORT = parseInt(configService.get('SERVER_PORT')) || 3000;

  /**  Hot-reload. Relevant:
   *   - webpack-hmr.config.js
   *   - package.json scripts start:dev
   */
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('CSide API')
    .setDescription('Booking service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(SERVER_PORT);
}

bootstrap();
