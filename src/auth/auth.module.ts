import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "@/user/user.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<JwtModuleOptions> => {
        return {
          secret: process.env.JWT_SECRET || "freelancer-jwt-secret",
          signOptions: {
            expiresIn: "2d"
          }
        };
      }
    }),
    forwardRef(() => UserModule)
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
