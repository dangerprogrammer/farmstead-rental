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
    
    await this.message.createMessage(details);

    const chatMessages = await this.search.searchAllChatMessages(id);

    for (const { socketId } of connections) this.server.to(socketId).emit('update-messages-chat', { chatId: id, messages: chatMessages });
  }

  @SubscribeMessage('visualize-message')
  async visualizeMessage(_socket: Socket, { sub, chatId }: { sub: string, chatId: string }) {
    const connections = await this.search.searchConnectionsByUser(sub);
    const messages = await this.search.searchAllChatMessages(chatId);

    const chatMessages = await Promise.all(messages.map(async ({ id }) => await this.message.updateMessageVisualized(id, sub)));

    for (const { socketId } of connections) this.server.to(socketId).emit('update-messages-chat', { chatId, messages: chatMessages });
  }
}