import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<JwtModuleOptions> => {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "24d"
      }
    };
  }
};
