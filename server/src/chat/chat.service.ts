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
  ) { }

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

  async unlinkUserFromPrivateChat(sub: string, id: string) {
    if (!this.isValidUUID(id)) throw new NotFoundException('ID inválido');

    const privateChat = await this.searchPrivateChat(id);

    privateChat.users = privateChat.users.filter(({ sub: uSub }) => uSub != sub);

    await this.privateChatRepo.save(privateChat);

    this.server.emit('update-private-chats', await this.searchPrivateChats());
  }

  searchPrivateChat(id: string, hasMessages: boolean = !1) {
    if (!this.isValidUUID(id)) throw new NotFoundException('ID inválido');

    const relations = {
      users: !0,
      ...(hasMessages && { messages: !0 })
    };

    return this.privateChatRepo.findOne({ where: { id }, relations });
  }

  searchPublicChat(id: string, hasMessages: boolean = !1) {
    if (!this.isValidUUID(id)) throw new NotFoundException('ID inválido');

    const relations = {
      owner: !0,
      users: !0,
      ...(hasMessages && { messages: !0 })
    };

    return this.publicChatRepo.findOne({ where: { id }, relations });
  }

  searchPrivateChatsByUser(sub: string) {
    return this.privateChatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'user')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('chat_sub.id')
          .from(PrivateChat, 'chat_sub')
          .leftJoin('chat_sub.users', 'user_sub')
          .where('user_sub.sub = :sub')
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameter('sub', sub)
      .getMany();
  }

  searchPublicChatsByUser(sub: string) {
    return this.publicChatRepo.find({
      where: { users: { sub } }, relations: {
        owner: !0,
        users: !0
      }
    });
  }

  searchPrivateChats() {
    return this.privateChatRepo.find({
      relations: {
        users: !0
      }
    });
  }

  searchPublicChats() {
    return this.publicChatRepo.find({
      relations: {
        owner: !0,
        users: !0
      }
    });
  }

  private isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }
}