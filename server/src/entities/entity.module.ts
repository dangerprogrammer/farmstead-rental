import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Connection, Message, PrivateChat, PublicChat } from ".";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, Connection, Message, PrivateChat, PublicChat])],
    exports: [TypeOrmModule]
})
export class EntityModule {}