import { Module } from "@nestjs/common";
import { GuildsController } from "./guilds.controller";
import { GuildsService } from "./guilds.service";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/user.schema";
import { Guild, GuildSchema } from "./guild.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Guild.name,
        schema: GuildSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [GuildsController],
  providers: [GuildsService, SnowflakeGenerator],
})
export class GuildsModule {}
