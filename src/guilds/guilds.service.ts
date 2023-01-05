import {Inject, Injectable} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Guild, GuildDocument } from "./guild.schema";
import { Model } from "mongoose";
import {SnowflakeGenerator} from "../utils/generate-snowflake.util";
import {CreateGuildDto} from "./dto/create-guild.dto";
import {CurrentUserType} from "../decorators/current-user.decorator";

@Injectable()
export class GuildsService {
  constructor(
    @InjectModel('Guild') private readonly guildModel: Model<GuildDocument>,
    @Inject(SnowflakeGenerator) private readonly snowflakeGenerator: SnowflakeGenerator
  ) {}

  async create(guild: CreateGuildDto, user: CurrentUserType) {
    const newGuild = new this.guildModel(guild);

    newGuild.set('_id', this.snowflakeGenerator.generateSnowflake());
    newGuild.set('owner', user._id);

    await newGuild.save();
    return newGuild.populate("owner");
  }
}
