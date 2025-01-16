import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Connection } from "./connection.entity";
import { PrivateChat, PublicChat } from "./chat.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn()
    sub: string;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    picture: string;

    @OneToMany(() => Connection, ({ user }) => user)
    connections: Connection[];

    @ManyToMany(() => PrivateChat, ({ users }) => users)
    @JoinTable()
    privateChats: PrivateChat[];

    @ManyToMany(() => PublicChat, ({ users }) => users)
    @JoinTable()
    publicChats: PublicChat[];

    @OneToMany(() => PublicChat, ({ owner }) => owner)
    publicChatsOwned: PublicChat[];
}