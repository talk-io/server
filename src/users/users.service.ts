import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { CurrentUserType } from "../decorators/current-user.decorator";
import { JwtService } from "@nestjs/jwt";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { Channel, ChannelDocument } from "../guilds/channels/channel.schema";
import { ChannelType } from "../types/channel.type";
import { Guild, GuildDocument } from "../guilds/guild.schema";

const bcrypt = require("bcrypt");

export type LoggedInUser = User & { token: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async create(user: CreateUserDto): Promise<LoggedInUser> {
    const users = await this.userModel.find({ email: user.email });
    if (users.length) throw new BadRequestException("Email is already in use!");

    const newUser = new this.userModel(user);
    newUser.discriminator = await this._generateDiscriminator(user.username);

    newUser._id = new SnowflakeGenerator().generateSnowflake();
    console.log(newUser._id);
    const payload = { _id: newUser._id, username: newUser.username };
    const token = this.jwtService.sign(payload);
    newUser.tokens.push(token);

    await newUser.save();

    return { token, ...newUser.toObject() };
  }

  async login(loginData: LoginUserDto): Promise<LoggedInUser> {
    const user = await this.userModel.findOne({ email: loginData.email });
    if (!user) throw new BadRequestException("The email is not registered!");

    const isPasswordCorrect = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordCorrect)
      throw new BadRequestException("The given password is incorrect!");

    const token = this.jwtService.sign({
      _id: user._id,
      username: user.username,
    });
    user.tokens.push(token);
    await user.save();
    return { ...user.toObject(), token };
  }

  async findOne(userId: string) {
    return this.userModel.findById(userId).populate("guilds");
  }

  async signOut(currentUser: CurrentUserType) {
    const user = await this.userModel.findById(currentUser._id);
    const tokenIndex = user.tokens.findIndex((i) => i === currentUser.token);
    user.tokens.splice(tokenIndex, 1);

    await user.save();

    return;
  }

  public async validateUser(loginData: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginData.email });
    if (!user) throw new BadRequestException("The email is not registered!");

    return bcrypt.compare(loginData.password, user.password);
  }

  public async verifyToken(token: string) {
    const payload = await this.jwtService.verify(token);

    const res = await this.userModel.findOne({
      _id: payload._id,
      tokens: { $in: [token] },
    });

    if (!res) throw new BadRequestException("Invalid token!");

    const populateRes = await res.populate({
      path: "guilds",
      populate: {
        path: "channels",
      },
    });

    const user = populateRes.toObject();
    const { guilds } = user;

    const channels = guilds.reduce((acc, guild) => {
      // @ts-ignore
      // const textChannels = guild.channels.filter(
      //   (channel) => channel.type === ChannelType.GUILD_TEXT
      // );
      // @ts-ignore
      return [...acc, ...guild.channels.map((channel) => channel._id)];
    }, []);

    return { user, channels };
  }

  private async _generateDiscriminator(username) {
    const generate = () => Math.floor(Math.random() * 9999);
    const userExists = async (discriminator: number) =>
      this.userModel.find({ username, discriminator });

    let discriminator = generate();
    let usersWithDiscriminator = await userExists(discriminator);

    while (usersWithDiscriminator.length > 0) {
      discriminator = generate();
      usersWithDiscriminator = await userExists(discriminator);
    }

    return discriminator;
  }
}
