import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'connections' })
export class Connection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    socketId: string;

    @ManyToOne(() => User, ({ connections }) => connections)
    user: User;

    @RelationId(({ user }: Connection) => user)
    userSub: number;
}