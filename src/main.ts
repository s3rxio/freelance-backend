import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { validationPipeConfig } from "./common/configs/validation-pipe.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
