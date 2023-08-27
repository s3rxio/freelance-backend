import { Role } from "@/role/role.decorator";
import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { RoleGuard } from "@/role/role.guard";

export const Auth = (...roles: string[]) =>
  applyDecorators(Role(...roles), UseGuards(AuthGuard, RoleGuard));
