import {IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from "class-validator";

export class CreateGuildDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  description: string;
}
