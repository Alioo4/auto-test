import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const globalPrefix = 'api/avto-test';
    const swaggerPath = `${globalPrefix}/docs`;

    app.use(
        `/${swaggerPath}`,
        basicAuth({
            challenge: true,
            users: {
                developer: configService.get('SWAGGER_PASSWORD') || 'defaultpass',
            },
        })
    );

    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        })
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Avto Test API')
        .setDescription('Swagger documentation for the Avto Test module')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('avto-test')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, swaggerDocument);

    const PORT = configService.get<number>('PORT') || 3001;

    await app.listen(PORT, () => {
        console.log(`🚀 Server is running on: http://localhost:${PORT}`);
        console.log(`📘 Swagger is running on: http://localhost:${PORT}/${swaggerPath}`);
    });
}

bootstrap();
