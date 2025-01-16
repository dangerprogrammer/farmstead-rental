import { Message } from "./message.type";
import { User } from ".";

type Chat = {
    id: string;
}

export type PrivateChat = Chat & {
    users: User[];
    messages: Message[];
}

export type PublicChat = PrivateChat & {
    owner: User;
}