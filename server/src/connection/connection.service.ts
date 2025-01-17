import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection } from "src/entities";
import { Repository } from "typeorm";
import { Server } from "socket.io";
import { SearchService } from "src/search/search.service";

@Injectable()
export class ConnectionService {
    server: Server;

    constructor(
        @InjectRepository(Connection) private readonly connectionRepo: Repository<Connection>,
        @Inject(forwardRef(() => SearchService)) private readonly search: SearchService
    ) { }

    setServer(server: Server) {
        this.server = server;
    }

    async create(details: Partial<Connection>) {
        const connection = this.connectionRepo.create(details);

        await this.connectionRepo.save(connection);

        this.server.emit('update-users', await this.search.searchUsers());

        return await this.searchConnection(details.socketId);
    }

    async deleteBySocketId(socketId: string) {
        await this.connectionRepo.delete({ socketId });

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