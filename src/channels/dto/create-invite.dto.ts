import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateInviteDto {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsNotEmpty()
  maxAge: number;

  @IsNumber()
  @IsNotEmpty()
  maxUses: number;

  @IsBoolean()
  temporary: boolean;
}
