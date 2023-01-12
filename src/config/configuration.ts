import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  hash_rounds: parseInt(process.env.HASH_ROUNDS, 10) || 10,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
});

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get<string>("jwt_secret_key"),
      signOptions: { expiresIn: "30d" },
    };
  },
  inject: [ConfigService],
});
