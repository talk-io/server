import {
  BadRequestException,
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
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Events } from "../../../types/events";
import { SocketsService } from "../../../sockets/sockets.service";
import { Channel } from "../channel.schema";
import { Timeout } from "../../../interceptors/timeout.interceptor";

const {
  MessageEvents: { MESSAGE_CREATED },
} = Events;

@Controller()
@Timeout(5)
@Serialize(MessageDto)
@UseGuards(JwtAuthGuard)
export class MessagesController {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly socketsService: SocketsService
  ) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Param("channelID") channelID: string,
    @CurrentUser("_id") user: string
  ) {
    if (!channelID) throw new BadRequestException("Channel ID is required");

    const message = await this.messagesService.create(
      createMessageDto,
      channelID,
      user
    );

    const populatedMessage = await message.populate<{ channel: Channel }>([
      "author",
      "channel",
    ]);

    this.socketsService.socket
      .to(channelID)
      .emit(MESSAGE_CREATED, populatedMessage.toObject());

    return populatedMessage;
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
