import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('search')
export class SearchController {
    constructor(
        @Inject(SearchService) private search: SearchService,
    ) {}

    @Public()
    @Get('connections')
    getConnectionsBySub(@Query('sub') sub: string) {
        return this.search.searchConnectionsByUser(sub);
    }

    @Public()
    @Get('connections')
    getConnections() {
        return this.search.searchConnections();
    }

    @Public()
    @Get('user')
    getUser(@Query('sub') sub?: string, @Query('token') token?: string) {
        return sub ? this.search.searchUser(sub) : this.search.searchUserByToken(token);
    }

    @Public()
    @Get('users')
    getUsers() {
        return this.search.searchUsers();
    }

    @Public()
    @Get('private-chats/user')
    getPrivateChatsBySub(@Query('sub') sub: string) {
        return this.search.searchPrivateChatsByUser(sub);
    }

    @Public()
    @Get('public-chats/user')
    getPublicChatsBySub(@Query('sub') sub: string) {
        return this.search.searchPublicChatsByUser(sub);
    }

    @Public()
    @Get('private-chat')
    getPrivateChat(@Query('id') id: string) {
        return this.search.searchPrivateChat(id, !0);
    }

    @Public()
    @Get('public-chat')
    getPublicChat(@Query('id') id: string) {
        return this.search.searchPublicChat(id, !0);
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
    @Get('messages')
    getAllMessages(@Query('id') id: string) {
        return this.search.searchAllChatMessages(id);
    }

    @Public()
    @Get('messages/:id/last')
    getLastMessages(@Param('id') id: string) {
        return this.search.searchLastMessageChat(id);
    }

    @Public()
    @Get('unread-messages/:sub')
    getUnreadMessagesByUser(@Param('sub') sub: string, @Query('id') id: string) {
        return this.search.countUnreadByUser(id, sub);
    }
}