import { MessageService } from "./message.service";
import { forwardRef, Module } from "@nestjs/common";
import { MessageGateway } from "./message.gateway";
import { SearchModule } from "src/search/search.module";

@Module({
  imports: [forwardRef(() => SearchModule)],
  providers: [MessageGateway, MessageService],
  exports: [MessageService]
})
export class MessageModule {}