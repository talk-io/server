import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Guild, GuildDocument, PopulatedGuild } from "../guilds/guild.schema";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { PresenceStatus } from "../types/enums";

const bcrypt = require("bcrypt");

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  _id: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  virtuals: true,
})
export class User {
  @Prop({
    index: true,
    default: () => new SnowflakeGenerator().generateSnowflake(),
  })
  _id: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  discriminator: number;

  @Prop({ required: true })
  password: string;

  @Prop()
  tokens: Array<string>;

  @Prop([{ type: String, ref: "Guild" }])
  guilds: Array<string>;

  @Prop()
  sessions: Array<string>;

  @Prop({
    default: () => PresenceStatus.Online,
  })
  status: PresenceStatus;

  generateAuthToken: () => Promise<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, +process.env.HASH_ROUNDS);
  }

  next();
});

export interface PopulatedUser extends Omit<UserDocument, "guilds"> {
  guilds: Array<PopulatedGuild>;
}
