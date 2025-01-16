import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Connection, PrivateChat, PublicChat, User } from "../types";
import { Message } from "../types/message.type";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(
        private http: HttpClient
    ) {}

    user = (sub: string) => this.http.get<User>(`${environment.api}/search/user/${sub}`);

    userByToken = (token: string) => this.http.get<User>(`${environment.api}/search/user-token/${token}`);

    users = () => this.http.get<User[]>(`${environment.api}/search/users`);

    connectionsBySub = (sub: string) => this.http.get<Connection[]>(`${environment.api}/search/connections/${sub}`);
    
    connections = () => this.http.get<Connection[]>(`${environment.api}/search/connections`);

    privateChatsByUser = (sub: string) => this.http.get<PrivateChat[]>(`${environment.api}/search/private-chats/${sub}`);

    publicChatsByUser = (sub: string) => this.http.get<PublicChat[]>(`${environment.api}/search/public-chats/${sub}`);

    privateChats = () => this.http.get<PrivateChat[]>(`${environment.api}/search/private-chats`);

    publicChats = () => this.http.get<PublicChat[]>(`${environment.api}/search/public-chats`);

    messagesByChat = (id: string) => this.http.get<Message[]>(`${environment.api}/search/messages/${id}`);

    lastMessageChat = (id: string) => this.http.get<Message>(`${environment.api}/search/messages/last/${id}`);

    privateChat = (id: string) => this.http.get<PrivateChat | undefined>(`${environment.api}/search/private-chat/${id}`);

    publicChat = (id: string) => this.http.get<PublicChat | undefined>(`${environment.api}/search/public-chat/${id}`);
}