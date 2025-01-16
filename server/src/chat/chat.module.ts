import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { SearchService } from "src/search/search.service";
import { SearchModule } from "src/search/search.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [SearchModule],
  providers: [ChatGateway, {
    provide: 'CHAT_SERVICE',
    useClass: ChatService
  }, {
    provide: 'SEARCH_SERVICE',
    useClass: SearchService
  }]
})
export class ChatModule {}