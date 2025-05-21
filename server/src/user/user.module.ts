import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { PassportModule } from '@nestjs/passport';
import { SearchModule } from '../search/search.module';
import { EntityModule } from 'src/entities/entity.module';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => SearchModule),
    forwardRef(() => ConnectionModule),
    EntityModule
  ],
  providers: [UserGateway, UserService],
  exports: [UserService]
})
export class UserModule { }
