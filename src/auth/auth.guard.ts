import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@/user/user.service";
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected reflector: Reflector,
    protected jwtService: JwtService,
    protected userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });

      const user = await this.userService.findOneById(payload.id, {
        relations: ["roles"]
      });

      req.user = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(req: Request) {
    const [type, token] = req.headers["authorization"]?.split(" ") ?? [];

    return type === "Bearer" ? token : undefined;
  }
}
