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

const {
  MessageEvents: { MESSAGE_CREATED },
} = Events;

@WebSocketGateway()
export class MessagesGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket, room: string) {
    client.on("connect", () => {});
  }

  @SubscribeMessage(MESSAGE_CREATED)
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    // this.server.emit(MESSAGE_CREATED, createMessageDto);
    // return [1, 2, 3];
  }
}
