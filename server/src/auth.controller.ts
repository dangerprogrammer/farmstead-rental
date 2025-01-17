import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { UserService } from "./user/user.service";
import { Public } from "src/decorator/public.decorator";
import { PrivateChat, PublicChat } from "./entities";
import { ChatService } from "./chat/chat.service";

@Controller('auth')
export class AppController {
  constructor(
    @Inject(UserService) private readonly user: UserService,
    @Inject(ChatService) private readonly chat: ChatService
  ) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  handleLogin(@Body() { token }: { token: string }) {
    return this.user.login(token);
  }

  @Post('create-private-chat')
  @HttpCode(HttpStatus.CREATED)
  handlePrivateChatCreate(@Body() chat: PrivateChat) {
    return this.chat.createPrivateChat(chat);
  }

  @Post('create-public-chat')
  @HttpCode(HttpStatus.CREATED)
  handlePublicChatCreate(@Body() chat: PublicChat) {
    return this.chat.createPublicChat(chat);
  }
}