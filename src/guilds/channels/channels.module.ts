import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsController } from "./channels.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Channel, ChannelSchema } from "./channel.schema";
import { User, UserSchema } from "../../users/user.schema";
import { MessagesModule } from "./messages/messages.module";
import { UsersService } from "../../users/users.service";
import { JwtStrategy } from "../../users/strategies/jwt.strategy";
import { UsersModule } from "../../users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Channel.name,
        useFactory: () => {
          const schema = ChannelSchema;

          // Add Position
          schema.pre("validate", async function (next) {
            if (this.isNew) this.position = await this.addPosition.bind(this)();
            return next();
          });

          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule,
  ],
  providers: [ChannelsService, UsersService, JwtStrategy],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
