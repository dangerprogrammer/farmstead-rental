import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { SearchService } from '../search/search.service';

@Module({
  providers: [{
    provide: 'CONNECTION_SERVICE',
    useClass: ConnectionService
  }, {
    provide: 'SEARCH_SERVICE',
    useClass: SearchService
  }]
})
export class ConnectionModule {}
