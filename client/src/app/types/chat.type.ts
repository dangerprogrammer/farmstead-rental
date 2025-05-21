import { Message } from "./message.type";
import { User } from ".";

type Chat = {
    id: string;
    photo?: string;
    title?: string;
}

export type PrivateChat = Chat & {
    users: User[];
    messages: Message[];
}

export type PublicChat = Chat & {
    users: User[];
    messages: Message[];
    owner: User;
}