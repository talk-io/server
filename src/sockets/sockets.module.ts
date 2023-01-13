import {Global, Module} from '@nestjs/common';
import { SocketsService } from './sockets.service';

@Global()
@Module({
  providers: [SocketsService],
  exports: [SocketsService],
})
export class SocketsModule {}
