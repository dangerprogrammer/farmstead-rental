import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { UserService } from "./user/user.service";
import { Public } from "src/decorator/public.decorator";

@Controller('auth')
export class AppController {
  constructor(
    @Inject(UserService) private readonly user: UserService
  ) { }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  handleLogin(@Body() { token }: { token: string }) {
    return this.user.login(token);
  }
}