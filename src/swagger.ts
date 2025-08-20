import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { config } from './config';

export function setupSwagger(app: INestApplication) {
  app.use(
    ['/documentation', '/documentation-json'],
    basicAuth({
      challenge: true,
      users: {
        swagger: `${config.swagger.password}`,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Project Istoda')
    .setDescription('API documentation for Istoda')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // 👈 name to use in @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      staticCSP: false,
    },
  });
}
