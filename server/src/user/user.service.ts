import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { Server } from "socket.io";
import { SearchService } from 'src/search/search.service';

@Injectable()
export class UserService extends PassportSerializer {
    private client: OAuth2Client;
    server: Server;

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @Inject(forwardRef(() => SearchService)) private readonly search: SearchService
    ) {
        super();

        this.client = new OAuth2Client('51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com');
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
    }

    async deserializeUser(payload: any, done: Function) {
        const user = await this.searchUser(payload.id);

        return done(null, user || null);
    }

    setServer(server: Server) {
        this.server = server;
    }

    async validateUser(details: TokenPayload) {
        const user = await this.searchUser(details.sub);

        if (user) {
            if (!user.active) {
                user.active = !0;

                await this.userRepo.save(user);

                this.server.emit('update-user', { user: user });
            };

            return user;
        };

        return await this.createUser(details);
    }

    async createUser(details: TokenPayload) {
        const user = this.userRepo.create(details);

        await this.userRepo.save(user);

        this.server.emit('update-users', { users: await this.searchUsers(), reason: 'Usuário criado!' });

        return await this.searchUser(user.sub);
    }

    async deleteUser(details: User) {
        const user = await this.searchUser(details.sub);

        if (!user) return !1;

        await this.userRepo.save({ ...user, active: !1 });

        this.server.emit('update-user', { user: user });

        return user;
    }

    async login(token: string) {
        const user: TokenPayload = await this.searchUserByToken(token);

        if (!user) await this.createUser(user);

        return await this.searchUserByToken(token);
    }

    async searchUser(sub: string) {
        const user = await this.userRepo.findOneBy({ sub });

        return user;
    }

    searchUsers() {
        return this.userRepo.find();
    }

    async searchUserByToken(idToken: string) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken, audience: '51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com',
            });

            return ticket.getPayload();
        } catch (error) {
            return error;
        }
    }
}
