import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { GoogleGuard } from './guards/google.guard';
import { ConnectionModule } from './connection/connection.module';
import { AppGateway } from './app.gateway';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { AppController } from './auth.controller';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: !0 }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://danger:123@localhost:5432/nestjs?schema=public',
      autoLoadEntities: !0,
      synchronize: !0
    }),
    SearchModule,
    ConnectionModule,
    UserModule,
    ChatModule
  ],
  providers: [
    AppGateway,
    { provide: APP_GUARD, useClass: GoogleGuard }
  ],
  controllers: [AppController],
})
export class AppModule {}
