import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    try {
      if (!authHeader) return false;
      const token = authHeader.split(" ")[1];

      request.user = this.jwtService.verify(token);
      return true;
    } catch (e) {
      console.log({ e });
      return false;
    }
  }
}
