import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { appConfig } from "./common/configs/app.config";
import { typeOrmConfig } from "./common/configs/typeOrm.config";

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
