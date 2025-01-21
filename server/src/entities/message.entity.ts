import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, PrivateChat, PublicChat } from ".";

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column(() => User)
    owner: User;

    @Column()
    sendAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToMany(() => User)
    @JoinTable()
    visualizedBy: User[];

    @ManyToOne(() => PrivateChat, ({ messages }) => messages, { nullable: !0 })
    privateChat?: PrivateChat;

    @ManyToOne(() => PublicChat, ({ messages }) => messages, { nullable: !0 })
    publicChat?: PublicChat;
}