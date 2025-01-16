import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Connection, PrivateChat, PublicChat, User } from "../types";
import { APIService } from "./api.service";
import { Message } from "../types/message.type";

@Injectable({
    providedIn: 'root'
})
export class SearchService extends APIService {
    constructor(
        private http: HttpClient
    ) {
        super();
    }

    user = (sub: string) => this.http.get<User>(`${this.API}/search/user/${sub}`);

    userByToken = (token: string) => this.http.get<User>(`${this.API}/search/user-token/${token}`);

    users = () => this.http.get<User[]>(`${this.API}/search/users`);

    connectionsBySub = (sub: string) => this.http.get<Connection[]>(`${this.API}/search/connections/${sub}`);
    
    connections = () => this.http.get<Connection[]>(`${this.API}/search/connections`);

    privateChatsByUser = (sub: string) => this.http.get<PrivateChat[]>(`${this.API}/search/private-chats/${sub}`);

    publicChatsByUser = (sub: string) => this.http.get<PublicChat[]>(`${this.API}/search/public-chats/${sub}`);

    privateChats = () => this.http.get<PrivateChat[]>(`${this.API}/search/private-chats`);

    publicChats = () => this.http.get<PublicChat[]>(`${this.API}/search/public-chats`);

    messagesByChat = (id: string) => this.http.get<Message[]>(`${this.API}/search/messages/${id}`);

    lastMessageChat = (id: string) => this.http.get<Message>(`${this.API}/search/messages/last/${id}`);

    privateChat = (id: string) => this.http.get<PrivateChat | undefined>(`${this.API}/search/private-chat/${id}`);

    publicChat = (id: string) => this.http.get<PublicChat | undefined>(`${this.API}/search/public-chat/${id}`);
}