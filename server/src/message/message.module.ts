import { MessageService } from "./message.service";
import { Module } from "@nestjs/common";
import { MessageGateway } from "./message.gateway";

@Module({
  imports: [],
  providers: [MessageGateway, MessageService],
  exports: [MessageService]
})
export class MessageModule {}