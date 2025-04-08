import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

describe('Swagger Documentation (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configuration de Swagger pour les tests
    const config = new DocumentBuilder()
      .setTitle("API d'authentification")
      .setDescription("Documentation de l'API d'authentification")
      .setVersion('1.0')
      .addTag('auth')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
    await app.close();
  });

  it('/api (GET) should serve Swagger documentation', () => {
    return request(server)
      .get('/api')
      .expect(200)
      .expect('Content-Type', /html/);
  });

  it('/api-json (GET) should serve Swagger JSON', () => {
    return request(server)
      .get('/api-json')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});
