import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, User } from "src/entities";
import { Repository } from "typeorm";
import { Server } from "socket.io";
import { SearchService } from "src/search/search.service";

@Injectable()
export class ConnectionService {
    server: Server;

    constructor(
        @InjectRepository(Connection) private readonly connectionRepo: Repository<Connection>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject(forwardRef(() => SearchService)) private readonly search: SearchService
    ) { }

    setServer(server: Server) {
        this.server = server;
    }

    async create(details: Partial<Connection>) {
        const connection = this.connectionRepo.create(details);

        await this.connectionRepo.save(connection);

        const user = await this.search.searchUser(connection.userSub);

        user.status = 'Online';

        await this.userRepo.save(user);

        this.server.emit('update-users', { users: await this.search.searchUsers(), reason: 'Conexão criada!' });
        this.server.emit('update-private-chats', await this.search.searchPrivateChats());

        return await this.searchConnection(details.socketId);
    }

    async deleteBySocketId(socketId: string) {
        const connection = await this.searchConnection(socketId);

        await this.connectionRepo.delete({ socketId });

        const remainConnections = await this.searchConnectionsByUser(connection.userSub);

        const user = await this.search.searchUser(connection.userSub);

        const time = new Date().toLocaleString();

        user.status = remainConnections.length ? 'Online' : `Visto por último em ${time}`;

        await this.userRepo.save(user);

        this.server.emit('update-users', { users: await this.search.searchUsers(), reason: 'Conexão removida!' });
        this.server.emit('update-private-chats', await this.search.searchPrivateChats());

        return !0;
    }

    async deleteAll() {
        await this.connectionRepo.createQueryBuilder().delete().execute();
    }

    searchConnectionsByUser(sub: string) {
        return this.connectionRepo.find({
            where: { user: { sub } }
        });
    }

    searchConnection(socketId: string) {
        return this.connectionRepo.findOne({ where: { socketId } });
    }

    searchConnections() {
        return this.connectionRepo.find();
    }
}