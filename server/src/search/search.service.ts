import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { ConnectionService } from 'src/connection/connection.service';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService {
  constructor(
    @Inject(forwardRef(() => ConnectionService)) private readonly connect: ConnectionService,
    @Inject(UserService) private readonly user: UserService,
    @Inject(ChatService) private readonly chat: ChatService,
    @Inject(MessageService) private readonly message: MessageService
  ) {}

  searchConnectionsByUser = (sub: string) => this.connect.searchConnectionsByUser(sub);

  searchConnection = (socketId: string) => this.connect.searchConnection(socketId);

  searchConnections = () => this.connect.searchConnections();

  searchUser = (sub: string) => this.user.searchUser(sub);

  searchUserByToken = (idToken: string) => this.user.searchUserByToken(idToken);

  searchUsers = () => this.user.searchUsers();

  searchPrivateChatsByUser = (sub: string) => this.chat.searchPrivateChatsByUser(sub);

  searchPublicChatsByUser = (sub: string) => this.chat.searchPublicChatsByUser(sub);

  searchPrivateChat = (id: string, hasMessages: boolean) => this.chat.searchPrivateChat(id, hasMessages);

  searchPublicChat = (id: string, hasMessages: boolean) => this.chat.searchPublicChat(id, hasMessages);

  searchPrivateChats = () => this.chat.searchPrivateChats();

  searchPublicChats = () => this.chat.searchPublicChats();

  searchAllChatMessages = (id: string) => this.message.searchAllChatMessages(id);

  searchLastMessageChat = (id: string) => this.message.searchLastMessageChat(id);

  countUnreadByUser = (id: string, sub: string) => this.message.countUnreadByUser(id, sub);
}
