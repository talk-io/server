import {Module, ValidationPipe} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {MongooseModule} from "@nestjs/mongoose";
import {APP_PIPE} from "@nestjs/core";

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://127.0.0.1:27017/chatr"),
        UsersModule
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            })
        }
    ],
})
export class AppModule {
}
