import {BadRequestException, Inject, Injectable, NotFoundException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Guild, GuildDocument } from "./guild.schema";
import { Model } from "mongoose";
import {SnowflakeGenerator} from "../utils/generate-snowflake.util";
import {CreateGuildDto} from "./dto/create-guild.dto";
import {CurrentUserType} from "../decorators/current-user.decorator";
import {UserDocument} from "../users/user.schema";

@Injectable()
export class GuildsService {
  constructor(
    @InjectModel('Guild') private readonly guildModel: Model<GuildDocument>,
    @Inject(SnowflakeGenerator) private readonly snowflakeGenerator: SnowflakeGenerator,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async create(guild: CreateGuildDto, user: CurrentUserType) {
    const newGuild = new this.guildModel(guild);

    newGuild.set('_id', this.snowflakeGenerator.generateSnowflake());
    newGuild.set('owner', user._id);

    await newGuild.save();
    return newGuild.populate("owner");
  }

  async join(serverID: string, currentUser: CurrentUserType) {
    const guild = await this.guildModel.findById(serverID);
    if (!guild) throw new NotFoundException("No guild was found with the given ID!");

    const isMember = guild.members.includes(currentUser._id);
    if(isMember) throw new BadRequestException("You are already a member of this guild!");

    const user = await this.userModel.findById(currentUser._id);
    user.guilds.push(guild._id);
    guild.members.push(user._id);

    await Promise.all([user.save(), guild.save()]);

    return guild.populate(["owner", "channels", "members"]);
  }
}
