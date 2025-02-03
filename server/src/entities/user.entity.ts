import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Connection, PrivateChat, PublicChat } from ".";

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
    privateChats: PrivateChat[];

    @ManyToMany(() => PublicChat, ({ users }) => users)
    publicChats: PublicChat[];

    @OneToMany(() => PublicChat, ({ owner }) => owner)
    publicChatsOwned: PublicChat[];
}