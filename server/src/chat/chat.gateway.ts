import { Inject } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { PrivateChat, PublicChat } from "src/entities";

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(ChatService) private chat: ChatService
  ) {
    this.chat.setServer(this.server);
  }

  @SubscribeMessage('create-private-chat')
  async createPrivateChat(socket: Socket, details: PrivateChat) {
    this.chat.setServer(this.server);

    return await this.chat.createPrivateChat(details);
  }

  @SubscribeMessage('create-public-chat')
  async createPublicChat(socket: Socket, details: PublicChat) {
    this.chat.setServer(this.server);

    return await this.chat.createPublicChat(details);
  }
}