import { CrudController } from "@/common/crud/crud.controller";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@/auth/auth.guard";

@Controller("users")
export class UserController extends CrudController<User> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateDto);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Post("/reset")
  @UseGuards(AuthGuard)
  async reset() {
    return this.userService.reset();
  }
}
