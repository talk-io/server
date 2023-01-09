import { Module } from "@nestjs/common";
import { GuildsController } from "./guilds.controller";
import { GuildsService } from "./guilds.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/user.schema";
import { Guild, GuildSchema } from "./guild.schema";

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
  providers: [GuildsService],
})
export class GuildsModule {}
