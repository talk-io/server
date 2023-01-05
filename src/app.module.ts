import { Module, ValidationPipe } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_PIPE } from "@nestjs/core";
import { SnowflakeGenerator } from "./utils/generate-snowflake.util";
import { ChannelsModule } from "./channels/channels.module";
import { GuildsModule } from "./guilds/guilds.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/talkio"),
    UsersModule,
    ChannelsModule,
    GuildsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        // exceptionFactory: (errors) => {
        //     const modifiedErrors = {};
        //     errors.forEach(error => {
        //         modifiedErrors[error.property] = Object.values(error.constraints)[0];
        //     })
        //     return new BadRequestException({
        //         message: modifiedErrors,
        //     });
        // }
      }),
    },
    SnowflakeGenerator,
  ],
  exports: [SnowflakeGenerator],
})
export class AppModule {}
