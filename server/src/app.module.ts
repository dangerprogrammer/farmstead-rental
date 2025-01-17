import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { GoogleGuard } from './guards/google.guard';
import { ConnectionModule } from './connection/connection.module';
import { AppGateway } from './app.gateway';
import { ConnectionService } from './connection/connection.service';
import { SearchService } from './search/search.service';
import { UserService } from './user/user.service';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: !0 }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://danger:123@localhost:5432/nestjs?schema=public',
      autoLoadEntities: !0,
      synchronize: !0
    }),
    forwardRef(() => SearchModule),
    forwardRef(() => UserModule),
    forwardRef(() => ConnectionModule),
    forwardRef(() => ChatModule),
    forwardRef(() => MessageModule)
  ],
  providers: [
    AppGateway,
    ConnectionService,
    UserService,
    ChatService,
    SearchService,
    MessageService,
    { provide: APP_GUARD, useClass: GoogleGuard }
  ]
})
export class AppModule {}
