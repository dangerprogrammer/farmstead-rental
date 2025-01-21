import { PrivateChat, PublicChat, User } from ".";

export type Message = PendingMessage & {
    id: number;
    createdAt: Date;
}

export type PendingMessage = {
    content: string;
    owner: User;
    sendAt: Date;
    privateChat?: PrivateChat;
    publicChat?: PublicChat;
    visualizedBy: User[];
};