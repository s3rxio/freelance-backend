import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { User } from "./user/user.entity";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { RoleModule } from "./role/role.module";
import { Role } from "./role/role.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        `.env.${process.env.NODE_ENV}.local`,
        ".env",
        ".env.local"
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return {
          type: "postgres",
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          logging: true,
          logger: "file",
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
          entities: [User, Role]
        };
      }
    }),
    UserModule,
    AuthModule,
    RoleModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
