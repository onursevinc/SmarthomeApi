import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MyLogger } from './api/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule,
        {
            logger: new MyLogger(),
        },
    );

    app.setGlobalPrefix('api');
    app.enableCors();

    const options = new DocumentBuilder()
        .setTitle('Smart Home')
        .setDescription('The Smart Home API description')
        .setBasePath('api')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);
}

bootstrap();
