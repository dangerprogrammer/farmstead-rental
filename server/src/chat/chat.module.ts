import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [],
  providers: [ChatGateway, ChatService],
  exports: [ChatService]
})
export class ChatModule {}