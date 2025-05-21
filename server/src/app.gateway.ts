import { forwardRef, Inject } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ConnectionService } from "./connection/connection.service";
import { SearchService } from "./search/search.service";
import { UserService } from "./user/user.service";
import { bold, blueBright } from "colorette";

@WebSocketGateway({ namespace: 'socket', cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        @Inject(ConnectionService) private connect: ConnectionService,
        @Inject(UserService) private user: UserService,
        @Inject(SearchService) private search: SearchService
    ) {
        this.user.setServer(this.server);
        this.connect.setServer(this.server);
    }

    async handleConnection(socket: Socket) {
        this.user.setServer(this.server);
        this.connect.setServer(this.server);

        const token = socket.handshake.auth.authorization,
            details = await this.search.searchUserByToken(token),
            user = await this.user.validateUser(details);

        await this.connect.create({ socketId: socket.id, user });

        // this.logSocket({ msg: `${bold(details.email)} connected!` });
    }

    async handleDisconnect(socket: Socket) {
        this.user.setServer(this.server);
        this.connect.setServer(this.server);

        const token = socket.handshake.auth.authorization,
            details = await this.search.searchUserByToken(token);

        // this.logSocket({ msg: `${bold(details.email)} disconnected!` });

        await this.connect.deleteBySocketId(socket.id);

        socket.disconnect();
    }

    private logs: { msg: any, time: Date }[] = [];
    private logSocket = ({ push = !0, msg }: { push?: boolean, msg: any }) => {
        const data = new Date(),
            prefix = (time: Date) => `${blueBright(`[${time.toLocaleString()}]`)}`;

        if (push) this.logs.push({ msg, time: new Date() });

        console.clear();
        console.log(bold('\n\nSockets log:\n'));
        this.logs.forEach(({ msg, time }, i) => console.log(`${prefix(time)}`, msg));

        if (!push) console.log(`\n${prefix(data)}`, msg);
    }
}