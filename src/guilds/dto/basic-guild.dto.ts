import { Expose } from "class-transformer";

export class BasicGuildDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
