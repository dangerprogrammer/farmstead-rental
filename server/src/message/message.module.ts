import { SearchService } from "src/search/search.service";
import { MessageService } from "./message.service";
import { forwardRef, Module } from "@nestjs/common";
import { SearchModule } from "src/search/search.module";
import { MessageGateway } from "./message.gateway";

@Module({
  imports: [forwardRef(() => SearchModule)],
  providers: [MessageGateway, MessageService, SearchService]
})
export class MessageModule {}