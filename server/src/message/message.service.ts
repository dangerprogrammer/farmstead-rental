import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/entities";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>
  ) { }

  async createMessage(details: Message) {
    const message = this.messageRepo.create(details);

    await this.messageRepo.save(message);

    return await this.searchMessage(message.id);
  }

  searchAllChatMessages(id: string) {
    return this.messageRepo.find({
      where: [{ privateChat: { id } }, { publicChat: { id } }],
      relations: ['owner']
    });
  }

  searchLastMessageChat(id: string) {
    return this.messageRepo.findOne({
      where: [{ privateChat: { id } }, { publicChat: { id } }],
      order: { createdAt: 'desc' }
    });
  }

  searchMessage(id: number) {
    return this.messageRepo.findOne({ where: { id } });
  }
}