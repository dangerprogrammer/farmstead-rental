import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TokenPayload } from 'google-auth-library';
import { ChatService } from 'src/chat/chat.service';
import { ConnectionService } from 'src/connection/connection.service';
import { Connection, Message, PrivateChat, PublicChat, User } from 'src/entities';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SearchService {
  constructor(
    @Inject(forwardRef(() => ConnectionService)) private readonly connect: ConnectionService,
    @Inject(UserService) private readonly user: UserService,
    @Inject(ChatService) private readonly chat: ChatService,
    @Inject(MessageService) private readonly message: MessageService
  ) {
    this.searchConnectionsByUser = this.connect.searchConnectionsByUser;
    this.searchConnection = this.connect.searchConnection;
    this.searchConnections = this.connect.searchConnections;

    this.searchUser = this.user.searchUser;
    this.searchUserByToken = this.user.searchUserByToken;
    this.searchUsers = this.user.searchUsers;

    this.searchPrivateChatsByUser = this.chat.searchPrivateChatsByUser;
    this.searchPublicChatsByUser = this.chat.searchPublicChatsByUser;

    this.searchPrivateChat = this.chat.searchPrivateChat;
    this.searchPublicChat = this.chat.searchPublicChat;

    this.searchPrivateChats = this.chat.searchPrivateChats;
    this.searchPublicChats = this.chat.searchPublicChats;

    this.searchAllChatMessages = this.message.searchAllChatMessages;
    this.searchLastMessageChat = this.message.searchLastMessageChat;
  }

  searchConnectionsByUser: (sub: string) => Promise<Connection[]>;

  searchConnection: (socketId: string) => Promise<Connection>;

  searchConnections: () => Promise<Connection[]>;

  searchUser: (sub: string) => Promise<User>;

  searchUserByToken: (idToken: string) => Promise<TokenPayload>;

  searchUsers: () => Promise<User[]>;

  searchPrivateChatsByUser: (sub: string) => Promise<PrivateChat[]>;

  searchPublicChatsByUser: (sub: string) => Promise<PublicChat[]>;

  searchPrivateChat: (id: string, hasMessages: boolean) => Promise<PrivateChat>;

  searchPublicChat: (id: string, hasMessages: boolean) => Promise<PublicChat>;

  searchPrivateChats: () => Promise<PrivateChat[]>;

  searchPublicChats: () => Promise<PublicChat[]>;

  searchAllChatMessages: (id: string) => Promise<Message[]>;

  searchLastMessageChat: (id: string) => Promise<Message>;
}
