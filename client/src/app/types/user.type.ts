import { Connection, PrivateChat, PublicChat } from ".";

export type User = {
    sub: string;
    email: string;
    name: string;
    picture: string;
    connections: Connection[];
    privateChats: PrivateChat[];
    publicChats: PublicChat[];
    publicChatsOwned: PublicChat[];
}

export type GoogleUser = {
    authentication: {
        idToken: string;
    };
}

export type GooglePayload = {
    exp: number;
};

export type googleToken = {
    id_token: string;
    access_token: string;
}