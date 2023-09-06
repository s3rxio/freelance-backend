import { CrudService } from "@/common/crud/crud.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Role } from "./role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { UpdateRoleDto } from "./dtos/update-role.dto";

@Injectable()
export class RoleService extends CrudService<Role> {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {
    super(roleRepo);
  }

  async create(createDto: CreateRoleDto) {
    const role = this.roleRepo.create(createDto);
    await this.checkRole(role);

    try {
      return await this.roleRepo.save(role);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async update(
    criteria: number | FindOptionsWhere<Role>,
    updateDto: UpdateRoleDto
  ) {
    const role = await this.findOne({
      where: typeof criteria === "number" ? { id: criteria } : criteria
    });
    await this.checkRole(updateDto);

    try {
      return await this.roleRepo.update(role.id, updateDto);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async delete(criteria: number | FindOptionsWhere<Role>) {
    const role = await this.findOne({
      where: typeof criteria === "number" ? { id: criteria } : criteria
    });

    return super.delete(role.id);
  }

  async checkRole(role: Partial<Role>) {
    if (role.name && (await this.roleRepo.findOneBy({ name: role.name }))) {
      throw new BadRequestException("The role name already is taken!");
    }

    return role;
  }
}
