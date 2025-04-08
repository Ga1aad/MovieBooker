import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration de la validation globale
  app.useGlobalPipes(new ValidationPipe());

  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle("API d'authentification")
    .setDescription("Documentation de l'API d'authentification")
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth() // Pour la documentation de l'authentification JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
