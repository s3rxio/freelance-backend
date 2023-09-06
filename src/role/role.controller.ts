import { CrudController } from "@/common/crud/crud.controller";
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from "@nestjs/common";
import { Role } from "./role.entity";
import { RoleService } from "./role.service";
import { Auth } from "@/auth/auth.decorator";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";

@Auth("ADMIN")
@Controller("roles")
export class RoleController extends CrudController<Role> {
  constructor(private roleService: RoleService) {
    super(roleService);
  }

  @Post()
  async create(@Body() createDto: CreateRoleDto) {
    return this.roleService.create(createDto);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateRoleDto
  ) {
    return this.roleService.update(id, updateDto);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}
