import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
   app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // const config = new DocumentBuilder()
  //   .setTitle('AI Shopping Platform API')
  //   .setDescription('API documentation for AI-powered e-commerce platform')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
    
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
