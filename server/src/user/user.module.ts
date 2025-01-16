import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { AuthController } from '../auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SearchModule } from '../search/search.module';
import { SearchService } from '../search/search.service';
import { EntityModule } from 'src/entities/entity.module';
import { ConnectionService } from 'src/connection/connection.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [PassportModule, SearchModule, EntityModule],
  providers: [UserGateway,
    {
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
    }],
  controllers: [AuthController]
})
export class UserModule { }
