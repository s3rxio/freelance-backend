import { BaseController } from "@/common/base/base.controller";
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController extends BaseController<User> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateDto);
  }

  @Post("/reset")
  async reset() {
    return this.userService.reset();
  }
}
