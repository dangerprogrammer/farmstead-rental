import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "./message.service";
import { Inject } from "@nestjs/common";
import { Message } from "src/entities";

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class MessageGateway {
  @WebSocketServer() server: Server;

    constructor(
      @Inject(MessageService) private message: MessageService
    ) {}

    @SubscribeMessage('create-message')
      async createMessage(socket: Socket, details: Message) {
        const { users } = details.privateChat || details.publicChat;

        console.log(users);
        // const message = await this.message.createMessage(details);
    
        // this.server.to(socket.id).emit('receive-message', privateChat);
      }
}