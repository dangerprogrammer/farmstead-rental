import { forwardRef, Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { SearchService } from "src/search/search.service";
import { SearchModule } from "src/search/search.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [forwardRef(() => SearchModule)],
  providers: [ChatGateway, ChatService, SearchService]
})
export class ChatModule {}