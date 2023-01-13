import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { Events } from "../../../types/events";
import {GuildsService} from "../../guilds.service";

const {
  MessageEvents: { MESSAGE_CREATED },
} = Events;

@WebSocketGateway()
export class MessagesGateway {
  @WebSocketServer() server: Server;

  constructor(
      private readonly messagesService: MessagesService,
      private readonly guildsService: GuildsService
  ) {}

  @SubscribeMessage(MESSAGE_CREATED)
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    // const user = this.server.sockets.sockets.get(createMessageDto.author);
    // return this.server.to();
  }
}
