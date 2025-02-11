import { forwardRef, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { EntityModule } from 'src/entities/entity.module';
import { ConnectionModule } from 'src/connection/connection.module';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    EntityModule,
    forwardRef(() => ConnectionModule),
    UserModule,
    ChatModule,
    forwardRef(() => MessageModule)
  ],
  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService]
})
export class SearchModule {}
