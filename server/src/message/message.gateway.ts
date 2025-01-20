import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageService } from "./message.service";
import { Inject } from "@nestjs/common";
import { Message } from "src/entities";
import { SearchService } from "src/search/search.service";

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class MessageGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(MessageService) private message: MessageService,
    @Inject(SearchService) private readonly search: SearchService
  ) { }

  @SubscribeMessage('create-message')
  async createMessage(socket: Socket, details: Message) {
    const { users, id } = details.privateChat || details.publicChat;

    const connections = (await Promise.all(
      users.map(async ({ sub }) => await this.search.searchConnectionsByUser(sub))
    )).flat();
    
    const message = await this.message.createMessage(details);

    const chatMessages = await this.search.searchAllChatMessages(id);

    this.server.to(socket.id).emit('message-sent', message);

    for (const { socketId } of connections) this.server.to(socketId).emit('update-messages', chatMessages);
  }
}