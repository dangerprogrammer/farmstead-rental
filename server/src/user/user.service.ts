import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { SearchService } from '../search/search.service';
import { TokenPayload } from 'google-auth-library';
import { Server } from "socket.io";

@Injectable()
export class UserService extends PassportSerializer {
    server: Server;

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject('SEARCH_SERVICE') private readonly search: SearchService
    ) {
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.search.searchUser(payload.id);
        
        return done(null, user || null);
    }

    setServer(server: Server) {
        this.server = server;
    }

    async validateUser(details: TokenPayload) {
        const user = await this.search.searchUser(details.sub);

        if (user) return this.search.searchUser(details.sub);

        return await this.createUser(details);
    }

    async createUser(details: TokenPayload) {
        const user = this.userRepo.create(details);

        await this.userRepo.save(user);

        this.server.emit('update-users', await this.search.searchUsers());

        return await this.search.searchUser(details.sub);
    }

    async deleteUser(details: User) {
        const user = await this.search.searchUser(details.sub);

        if (!user) return !1;

        await this.userRepo.delete({ sub: details.sub });

        this.server.emit('update-users', await this.search.searchUsers());

        return !0;
    }

    async login(token: string) {
        const user = await this.search.searchUserByToken(token);

        if (!user) await this.createUser(user);

        return await this.search.searchUserByToken(token);
    }
}
