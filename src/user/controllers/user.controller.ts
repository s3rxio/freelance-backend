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
  Post
} from "@nestjs/common";
import { User } from "../user.entity";
import { UserService } from "../user.service";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { Auth } from "@/auth/auth.decorator";
import { Public } from "@/common/decorators/public.decorator";
import { AddRoleDto } from "../dtos/add-role.dto";

@Auth("admin")
@Controller("users/")
export class UserController extends CrudController<User> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Public()
  @Get(":id")
  async findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Post("/:id/role")
  async addRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: AddRoleDto
  ) {
    return this.userService.addRole(id, data.roleName);
  }

  @Delete("/:id/role")
  async removeRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: AddRoleDto
  ) {
    return this.userService.removeRole(id, data.roleName);
  }

  @Patch(":id")
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
}
