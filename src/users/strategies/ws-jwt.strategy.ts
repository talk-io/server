import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {WsException} from "@nestjs/websockets";
import {UsersService} from "../users.service";
import {LoginUserDto} from "../dtos/login-user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService
    ) {
        const jwtSecretKey = configService.get<string>("jwt_secret_key");
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
            ignoreExpiration: false,
            secretOrKey: jwtSecretKey,
        });
    }

    async validate(credentials: LoginUserDto) {
        const user = await this.usersService.validateUser(credentials);
        if (!user) throw new WsException("Invalid credentials");
        return user;
    }
}
