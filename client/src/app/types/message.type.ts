import { PrivateChat, PublicChat, User } from ".";

export type Message = {
    id: number;
    content: string;
    owner: User;
    createdAt: Date;
    privateChat?: PrivateChat;
    publicChat?: PublicChat;
}