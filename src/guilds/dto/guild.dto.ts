import { UserDto } from "../../users/dtos/user.dto";
import { Expose, Type } from "class-transformer";
import { User } from "../../users/user.schema";

export class GuildDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => UserDto)
  owner: User;
}
