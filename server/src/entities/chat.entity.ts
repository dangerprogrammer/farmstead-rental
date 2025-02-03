import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { User, Message } from ".";

@Entity({ name: 'chats' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
abstract class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}

@Entity({ name: 'private-chats' })
export class PrivateChat extends Chat {
    @ManyToMany(() => User, ({ privateChats }) => privateChats)
    @JoinTable()
    users: User[];

    @OneToMany(() => Message, ({ privateChat }) => privateChat)
    messages: Message[];
}

@Entity({ name: 'public-chats' })
export class PublicChat extends Chat {
    @ManyToMany(() => User, ({ publicChats }) => publicChats)
    @JoinTable()
    users: User[];

    @OneToMany(() => Message, ({ publicChat }) => publicChat)
    messages: Message[];

    @ManyToOne(() => User, ({ publicChatsOwned }) => publicChatsOwned)
    owner: User;
}