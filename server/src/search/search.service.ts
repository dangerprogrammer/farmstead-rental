import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Connection, Message, PrivateChat, PublicChat, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  private client: OAuth2Client;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Connection) private readonly connectionRepo: Repository<Connection>,
    @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
    @InjectRepository(PrivateChat) private readonly privateChatRepo: Repository<PrivateChat>,
    @InjectRepository(PublicChat) private readonly publicChatRepo: Repository<PublicChat>
  ) {
    this.client = new OAuth2Client('51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com');
  }

  async searchUser(sub: string) {
    const user = await this.userRepo.findOneBy({ sub });

    return user;
  }

  searchUsers() {
    return this.userRepo.find();
  }

  async searchUserByToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken, audience: '51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com',
    });

    return ticket.getPayload();
  }

  searchConnectionsByUser(sub: string) {
    return this.connectionRepo.find({
      where: { user: { sub } }
    });
  }

  searchConnection(socketId: string) {
    return this.connectionRepo.find({ where: { socketId } });
  }

  searchConnections() {
    return this.connectionRepo.find();
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

  private isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return regex.test(uuid);
  }
}
