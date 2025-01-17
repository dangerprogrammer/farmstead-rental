import { forwardRef, Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [forwardRef(() => SearchModule)],
  providers: [ConnectionService]
})
export class ConnectionModule {}
