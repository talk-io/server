import { Expose } from "class-transformer";
import { PresenceStatus } from "../../types/enums";

export class GuildUserDto {
  @Expose()
  _id: string;

  @Expose()
  username: string;

  @Expose()
  discriminator: string;

  @Expose()
  status: PresenceStatus;
}
