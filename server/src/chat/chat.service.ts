import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PrivateChat, PublicChat } from "src/entities";
import { Repository } from "typeorm";
import { Server } from "socket.io";
import { SearchService } from "src/search/search.service";

@Injectable()
export class ChatService {
    server: Server;

    constructor(
        @InjectRepository(PrivateChat) private readonly privateChatRepo: Repository<PrivateChat>,
        @InjectRepository(PublicChat) private readonly publicChatRepo: Repository<PublicChat>,
        @Inject('SEARCH_SERVICE') private readonly search: SearchService
    ) {}

    setServer(server: Server) {
        this.server = server;
    }

    async createPrivateChat(details: PrivateChat) {
        const privateChat = this.privateChatRepo.create(details);

        await this.privateChatRepo.save(privateChat);

        this.server.emit('update-private-chats', await this.search.searchPrivateChats());

        return await this.search.searchPrivateChat(details.id);
    }

    async createPublicChat(details: PublicChat) {
        const publicChat = this.publicChatRepo.create(details);

        await this.publicChatRepo.save(publicChat);

        this.server.emit('update-public-chats', await this.search.searchPublicChats());

        return await this.search.searchPublicChat(details.id);
    }
}