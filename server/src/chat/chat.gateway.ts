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

    const privateChat = await this.chat.createPrivateChat(details);

    this.server.to(socket.id).emit('confirm-private-chat', privateChat);
  }

  @SubscribeMessage('create-public-chat')
  async createPublicChat(socket: Socket, details: PublicChat) {
    this.chat.setServer(this.server);

    const publicChat = await this.chat.createPublicChat(details);

    this.server.to(socket.id).emit('confirm-public-chat', publicChat);
  }
}