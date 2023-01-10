import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Guild, GuildDocument } from "./guild.schema";
import { Model } from "mongoose";
import { CreateGuildDto } from "./dto/create-guild.dto";
import { CurrentUserType } from "../decorators/current-user.decorator";
import { UserDocument } from "../users/user.schema";

@Injectable()
export class GuildsService {
  constructor(
    @InjectModel("Guild") private readonly guildModel: Model<GuildDocument>,
    @InjectModel("User") private readonly userModel: Model<UserDocument>,
  ) {}

  async create(guild: CreateGuildDto, user: CurrentUserType) {
    const newGuild = new this.guildModel(guild);

    // Set the owner of the guild to the current user
    newGuild.set("ownerID", user._id);

    const currentUser = await this.userModel.findById(user._id);
    // Add the guild to the current user's guilds
    currentUser.guilds.push(newGuild._id);

    await newGuild.addDefaultChannels();

    // Create the default channels
    // await this.channelModel.addDefaultChannels(newGuild._id);

    await Promise.all([newGuild.save(), currentUser.save()])
    return newGuild.populate(["owner"]);
  }

  async join(serverID: string, currentUser: CurrentUserType) {
    const guild = await this.guildModel.findById(serverID);
    if (!guild)
      throw new NotFoundException("No guild was found with the given ID!");

    const user = await this.userModel.findById(currentUser._id);
    const isMember = user.guilds.includes(guild._id);
    if (isMember) {
      throw new BadRequestException("You are already a member of this guild!");
    }
    user.guilds.push(guild._id);

    await Promise.all([user.save()]);

    return guild.populate(["owner", "channels", "members"]);
  }

  async findOne(guildID: string) {
    const guild = await this.guildModel.findById(guildID);
    if(!guild) throw new NotFoundException("Requested Guild was not found!")

    return guild.populate(["owner", "channels", "members"])
  }
}
