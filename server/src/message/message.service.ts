import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/entities";
import { SearchService } from "src/search/search.service";
import { Not, Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    @Inject(forwardRef(() => SearchService)) private readonly search: SearchService
  ) { }

  async createMessage(details: Message) {
    const message = this.messageRepo.create(details);

    await this.messageRepo.save(message);

    return await this.searchMessage(message.id);
  }

  async updateMessageVisualized(id: number, sub: string) {
    const message = await this.messageRepo.findOne({ where: { id }, relations: { visualizedBy: !0 } });
    const user = await this.search.searchUser(sub);

    message.visualizedBy = [...message.visualizedBy, user];

    await this.messageRepo.save(message);

    return await this.searchMessage(id);
  }

  searchAllChatMessages(id: string) {
    return this.messageRepo.find({
      where: [{ privateChat: { id } }, { publicChat: { id } }],
      relations: {
        owner: !0,
        visualizedBy: !0
      }
    });
  }

  searchLastMessageChat(id: string) {
    return this.messageRepo.findOne({
      where: [{ privateChat: { id } }, { publicChat: { id } }],
      order: { createdAt: 'desc' },
      relations: {
        owner: !0,
        visualizedBy: !0
      }
    });
  }

  async countUnreadByUser(id: string, sub: string) {
    const user = await this.search.searchUser(sub);
    const count = await this.messageRepo.count({
      where: [
        {
          privateChat: { id },
          visualizedBy: {
            sub: Not(user.sub)
          }
        },
        {
          publicChat: { id },
          visualizedBy: {
            sub: Not(user.sub)
          }
        }
      ],
      relations: { visualizedBy: !0 }
    });

    const messages = await this.searchAllChatMessages(id);

    // PRECISO DESCOBRIR COMO CONTAR AS NÃO VISUALIZADAS!!!!
    // console.log(`O user "${user.email}" tem ${count} mensagens não lidas!`);
    // console.log(messages.map(({ id, visualizedBy }) => { return { id, visualizedBy } }));

    return count;
  }

  searchMessage(id: number) {
    return this.messageRepo.findOne({ where: { id } });
  }
}