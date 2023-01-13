import { Injectable } from '@nestjs/common';
import {Server} from "socket.io";

@Injectable()
export class SocketsService {
    public socket: Server = null;
}
