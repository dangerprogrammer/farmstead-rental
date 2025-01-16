import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(passport.initialize());
  app.use(
    session({
      secret: '123456',
      resave: false,
      saveUninitialized: false,
    }),
  );
  
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
