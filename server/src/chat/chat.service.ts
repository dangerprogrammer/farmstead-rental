import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PrivateChat, PublicChat } from "src/entities";
import { Repository } from "typeorm";
import { Server } from "socket.io";

@Injectable()
export class ChatService {
    server: Server;

    constructor(
        @InjectRepository(PrivateChat) private readonly privateChatRepo: Repository<PrivateChat>,
        @InjectRepository(PublicChat) private readonly publicChatRepo: Repository<PublicChat>
    ) {}

    setServer(server: Server) {
        this.server = server;
    }

    async createPrivateChat(details: PrivateChat) {
        const privateChat = this.privateChatRepo.create(details);

        await this.privateChatRepo.save(privateChat);

        this.server.emit('update-private-chats', await this.searchPrivateChats());

        return await this.searchPrivateChat(privateChat.id);
    }

    async createPublicChat(details: PublicChat) {
        const publicChat = this.publicChatRepo.create(details);

        await this.publicChatRepo.save(publicChat);

        this.server.emit('update-public-chats', await this.searchPublicChats());

        return await this.searchPublicChat(details.id);
    }

    searchPrivateChat(id: string, hasMessages: boolean = !1) {
        if (!this.isValidUUID(id)) throw new NotFoundException('ID inválido');
    
        const relations = ['users'];
    
        hasMessages && relations.push('messages');
    
        return this.privateChatRepo.findOne({ where: { id }, relations });
      }
    
      searchPublicChat(id: string, hasMessages: boolean = !1) {
        if (!this.isValidUUID(id)) throw new NotFoundException('ID inválido');
    
        const relations = ['owner', 'users'];
    
        hasMessages && relations.push('messages');
    
        return this.publicChatRepo.findOne({ where: { id }, relations });
      }
    
      searchPrivateChatsByUser(sub: string) {
        return this.privateChatRepo.find({
          where: { users: { sub } }, relations: ['users']
        });
      }
    
      searchPublicChatsByUser(sub: string) {
        return this.publicChatRepo.find({
          where: { users: { sub } }, relations: ['owner', 'users']
        });
      }
    
      searchPrivateChats() {
        return this.privateChatRepo.find({ relations: ['users'] });
      }
    
      searchPublicChats() {
        return this.publicChatRepo.find({ relations: ['owner', 'users'] });
      }

      private isValidUUID(uuid: string): boolean {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return regex.test(uuid);
      }
}