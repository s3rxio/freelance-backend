import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthModule } from "@/auth/auth.module";
import { Role } from "@/role/role.entity";
import { RoleModule } from "@/role/role.module";
import { UserMeController } from "./controllers/user-me.controller";

@Module({
  controllers: [UserMeController, UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => AuthModule),
    RoleModule
  ],
  exports: [UserService]
})
export class UserModule {}
