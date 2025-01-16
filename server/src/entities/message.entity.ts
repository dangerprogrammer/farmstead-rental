import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { PrivateChat, PublicChat } from "./chat.entity";

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column(() => User)
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => PrivateChat, ({ messages }) => messages, { nullable: !0 })
    privateChat?: PrivateChat;

    @ManyToOne(() => PublicChat, ({ messages }) => messages, { nullable: !0 })
    publicChat?: PublicChat;
}