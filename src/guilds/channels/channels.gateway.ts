import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChannelsService } from './channels.service';

@WebSocketGateway()
export class ChannelsGateway {
  constructor(private readonly channelsService: ChannelsService) {}

  // @SubscribeMessage('createChannel')
  // create(@MessageBody() createChannelDto: CreateChannelDto) {
  //   return this.channelsService.create(createChannelDto);
  // }
  //
  // @SubscribeMessage('findAllChannels')
  // findAll() {
  //   return this.channelsService.findAll();
  // }
  //
  // @SubscribeMessage('findOneChannel')
  // findOne(@MessageBody() id: number) {
  //   return this.channelsService.findOne(id);
  // }
  //
  // @SubscribeMessage('updateChannel')
  // update(@MessageBody() updateChannelDto: UpdateChannelDto) {
  //   return this.channelsService.update(updateChannelDto.id, updateChannelDto);
  // }
  //
  // @SubscribeMessage('removeChannel')
  // remove(@MessageBody() id: number) {
  //   return this.channelsService.remove(id);
  // }
}
