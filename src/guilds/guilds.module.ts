import { Module } from "@nestjs/common";
import { GuildsController } from "./guilds.controller";
import { GuildsService } from "./guilds.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/user.schema";
import { Guild, GuildSchema } from "./guild.schema";
import { GuildsGateway } from "./guilds.gateway";
import { UsersService } from "../users/users.service";
import { jwtModule } from "../config/configuration";
import {JwtStrategy} from "../users/strategies/jwt.strategy";

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
    jwtModule,
  ],
  controllers: [GuildsController],
  providers: [GuildsService, UsersService, GuildsGateway, JwtStrategy],
})
export class GuildsModule {}
