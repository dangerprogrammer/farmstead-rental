import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SearchService } from '../search/search.service';
import { UserService } from './user.service';
import { ConnectionService } from 'src/connection/connection.service';

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class UserGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(UserService) private readonly user: UserService,
    @Inject(ConnectionService) private readonly connect: ConnectionService,
    @Inject(SearchService) private readonly search: SearchService
  ) {
    this.user.setServer(this.server);
    this.connect.setServer(this.server);
  }

  @SubscribeMessage('delete-user')
  async deleteUser(socket: Socket, token: string) {
    this.user.setServer(this.server);
    this.connect.setServer(this.server);
    
    const { sub } = await this.search.searchUserByToken(token),
      user = await this.search.searchUser(sub),
      connections = await this.search.searchConnectionsByUser(sub);

    await (async () => {
      for (const { socketId } of connections) await this.connect.deleteBySocketId(socketId);
    })();

    return await this.user.deleteUser(user);
  }
}
