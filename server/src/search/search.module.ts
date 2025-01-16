import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { EntityModule } from 'src/entities/entity.module';

@Module({
  imports: [EntityModule],
  providers: [{
    provide: 'SEARCH_SERVICE',
    useClass: SearchService
  }],
  controllers: [SearchController]
})
export class SearchModule {}
