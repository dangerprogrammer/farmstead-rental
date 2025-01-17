import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { AuthController } from '../auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SearchModule } from '../search/search.module';
import { SearchService } from '../search/search.service';
import { EntityModule } from 'src/entities/entity.module';
import { ConnectionService } from 'src/connection/connection.service';

@Module({
  imports: [PassportModule, forwardRef(() => SearchModule), EntityModule],
  providers: [UserGateway, ConnectionService, UserService, SearchService],
  controllers: [AuthController]
})
export class UserModule { }
