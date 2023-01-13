import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";
import { CurrentUser } from "../../../decorators/current-user.decorator";
import { Serialize } from "../../../interceptors/serialize.interceptor";
import { MessageDto } from "./dto/message.dto";
import { JwtAuthGuard } from "../../../guards/auth.guard";
import { ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Events } from "../../../types/events";
import { SocketsService } from "../../../sockets/sockets.service";
import { ChannelsService } from "../channels.service";

const {
  MessageEvents: { MESSAGE_CREATED },
} = Events;

@Controller()
@Serialize(MessageDto)
@UseGuards(JwtAuthGuard)
export class MessagesController {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly socketsService: SocketsService,
    private readonly channelsService: ChannelsService
  ) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Param("channelID") channelID: string,
    @CurrentUser("_id") user: string
  ) {
    const message = await this.messagesService.create(
      createMessageDto,
      channelID,
      user
    );

    const channel = await this.channelsService.findOne(channelID);
    const populatedMessage = await message.populate(["author", "channel"]);
    console.log({ a: channel.guildID });
    this.socketsService.socket
      .to(channel.guildID)
      .emit(MESSAGE_CREATED, populatedMessage);
    return populatedMessage;
    // this.socketsService.socket.e.broadcast
    //   .to(guildID)
    //   .emit(MESSAGE_CREATED, await message.populate(["author", "channel"]));
  }

  @Get()
  async getAllMessagesInCurrentChannel(
    @Param("channelID") channelID: string,
    @Query("limit") limit: number,
    @Query("before") before: number
  ) {
    return this.messagesService.getAllMessagesInCurrentChannel(
      channelID,
      limit,
      before
    );
  }
}
