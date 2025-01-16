import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: !0 }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://danger:123@localhost:5432/nestjs?schema=public',
      autoLoadEntities: !0,
      synchronize: !0
    }),
    UserModule,
    ConnectionModule,
    ChatModule
  ],
  providers: [AppGateway, {
      provide: 'CONNECTION_SERVICE',
      useClass: ConnectionService
    }, {
      provide: 'USER_SERVICE',
      useClass: UserService
    }, {
      provide: 'CHAT_SERVICE',
      useClass: ChatService
    }, {
      provide: 'SEARCH_SERVICE',
      useClass: SearchService
    },
    { provide: APP_GUARD, useClass: GoogleGuard }
  ]
})
export class AppModule {}
