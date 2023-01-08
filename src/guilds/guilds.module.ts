import { Module } from "@nestjs/common";
import { GuildsController } from "./guilds.controller";
import { GuildsService } from "./guilds.service";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/user.schema";
import { Guild, GuildSchema } from "./guild.schema";
import { ChannelType } from "../types/channel.type";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Guild.name,
        useFactory: () => {
          const schema = GuildSchema;

          // schema.pre("validate", async function (next) {
          //   if (this.isNew) this.addDefaultChannels.bind(this)();
          //   return next();
          // });

          return schema;
        },
      },
    ]),
  ],
  controllers: [GuildsController],
  providers: [GuildsService, SnowflakeGenerator],
})
export class GuildsModule {}
