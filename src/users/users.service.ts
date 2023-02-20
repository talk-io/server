import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PopulatedUser, User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { CurrentUserType } from "../decorators/current-user.decorator";
import { JwtService } from "@nestjs/jwt";
import { SnowflakeGenerator } from "../utils/generate-snowflake.util";
import { PresenceStatus } from "../types/enums";
import { SocketsService } from "../sockets/sockets.service";
import { plainToInstance } from "class-transformer";
import { GuildUserDto } from "./dtos/guild-user.dto";

const bcrypt = require("bcrypt");

export type LoggedInUser = User & { token: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly socketsService: SocketsService
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
    if (!user)
      throw new BadRequestException({
        email: "The email is not registered!",
      });

    const isPasswordCorrect = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordCorrect)
      throw new BadRequestException({
        password: "The given password is incorrect!",
      });

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

  async findByIDAndToken(_id: string, token: string) {
    return this.userModel.findOne({
      _id: _id,
      tokens: { $in: [token] },
    });
  }

  public async verifyToken(token: string) {
    const payload = await this.jwtService.verify(token);

    const response = await this.findByIDAndToken(payload._id, token);

    if (!response) throw new BadRequestException("Invalid token!");

    return response;
  }

  async getInitialData(user: UserDocument, socketID: string) {
    this.socketsService.addUserSocket(user._id, socketID);
    const userWithGuilds = await user.populate({
      path: "guilds",
      populate: [
        "channels",
        {
          path: "members",
          transform: (doc: UserDocument) => {
            const isOnline = this.socketsService.getUserSockets(doc._id);
            doc.status = isOnline ? doc.status : PresenceStatus.Offline;

            return plainToInstance(GuildUserDto, doc.toObject(), {
              excludeExtraneousValues: true,
            });
          },
        },
        "owner",
      ],
    });

    const userPopulated = userWithGuilds.toObject<PopulatedUser>();

    const guilds = [];
    const channels = [];

    userPopulated.guilds.forEach((guild) => {
      guilds.push(guild._id);
      guild.channels.forEach((channel) => channels.push(channel._id));
    });

    return { user: userPopulated, rooms: { channels, guilds } };
  }

  private async _generateDiscriminator(username) {
    const generate = () => Math.floor(Math.random() * (9999 - 1000) + 1000);
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
