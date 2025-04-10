import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'https://moviebooker-gf.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

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

  // Mécanisme anti-veille
  const serverUrl = `http://localhost:${process.env.PORT ?? 3000}`;
  setInterval(
    async () => {
      try {
        await fetch(serverUrl);
        console.log('Ping de maintien en activité effectué');
      } catch (error) {
        console.error('Erreur lors du ping de maintien en activité:', error);
      }
    },
    14 * 60 * 1000,
  );
}
bootstrap();
