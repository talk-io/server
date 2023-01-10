import {Module} from '@nestjs/common';
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.schema";
import {UsersGateway} from "./users.gateway";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersGateway],
})
export class UsersModule {
}
