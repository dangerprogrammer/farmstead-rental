import { Controller, Get, Inject, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('search')
export class SearchController {
    constructor(
        @Inject(SearchService) private search: SearchService,
    ) {}

    @Public()
    @Get('user/:sub')
    getUser(@Param('sub') sub: string) {
        return this.search.searchUser(sub);
    }

    @Public()
    @Get('user-token/:token')
    getUserByToken(@Param('token') token: string) {
        return this.search.searchUserByToken(token);
    }

    @Public()
    @Get('users')
    getUsers() {
        return this.search.searchUsers();
    }

    @Public()
    @Get('connections/:sub')
    getConnectionsBySub(@Param('sub') sub: string) {
        return this.search.searchConnectionsByUser(sub);
    }

    @Public()
    @Get('connections')
    getConnections() {
        return this.search.searchConnections();
    }

    @Public()
    @Get('private-chats/:sub')
    getPrivateChatsBySub(@Param('sub') sub: string) {
        return this.search.searchPrivateChatsByUser(sub);
    }

    @Public()
    @Get('public-chats/:sub')
    getPublicChatsBySub(@Param('sub') sub: string) {
        return this.search.searchPublicChatsByUser(sub);
    }

    @Public()
    @Get('private-chats')
    getPrivateChats() {
        return this.search.searchPrivateChats();
    }

    @Public()
    @Get('public-chats')
    getPublicChats() {
        return this.search.searchPublicChats();
    }

    @Public()
    @Get('messages/:id')
    getAllMessages(@Param('id') id: string) {
        return this.search.searchAllChatMessages(id);
    }

    @Public()
    @Get('messages/last/:id')
    getLastMessages(@Param('id') id: string) {
        return this.search.searchLastMessageChat(id);
    }

    @Public()
    @Get('private-chat/:id')
    getPrivateChat(@Param('id') id: string) {
        return this.search.searchPrivateChat(id, !0);
    }

    @Public()
    @Get('public-chat/:id')
    getPublicChat(@Param('id') id: string) {
        return this.search.searchPublicChat(id, !0);
    }
}