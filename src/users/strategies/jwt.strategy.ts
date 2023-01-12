import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "../dtos/login-user.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService
  ) {
    const jwtSecretKey = configService.get<string>("jwt_secret_key");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecretKey,
    });
  }

  async validate(credentials: LoginUserDto) {
    const user = await this.usersService.validateUser(credentials);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return user;
  }
}
