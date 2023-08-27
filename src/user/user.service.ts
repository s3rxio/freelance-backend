import { CrudService } from "@/common/crud/crud.service";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException
} from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { REQUEST } from "@nestjs/core";
import { RoleService } from "@/role/role.service";

@Injectable({ scope: Scope.REQUEST })
export class UserService extends CrudService<User> {
  constructor(
    @Inject(REQUEST) private req: Request,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private roleService: RoleService
  ) {
    super(userRepo);
  }

  async findMe() {
    const user: User = this.req["user"];

    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.findOneById(user.id, {
      relations: ["roles"]
    }).catch(() => {
      throw new UnauthorizedException();
    });
  }

  async create(createDto: CreateUserDto) {
    const user = this.userRepo.create(createDto);
    await this.checkUser(user);

    return await this.userRepo.save(user).catch(() => {
      throw new BadRequestException();
    });
  }

  async update(
    criteria: number | FindOptionsWhere<User>,
    updateDto: UpdateUserDto
  ) {
    const user = await this.findOne({
      where: typeof criteria === "number" ? { id: criteria } : criteria
    });
    await this.checkUser(updateDto);

    return super.update(user.id, updateDto);
  }

  async delete(criteria: number | FindOptionsWhere<User>) {
    const user = await this.findOne({
      where: typeof criteria === "number" ? { id: criteria } : criteria
    });

    return super.delete(user.id);
  }

  async reset() {
    const users = await this.findMany({ select: ["id"] });
    if (users.length <= 0) {
      throw new NotFoundException("So and so there are no users!");
    }
    const ids = users.map(user => user.id);
    return await this.userRepo.delete(ids);
  }

  async addRole(id: number, name: string) {
    const user = await this.findOneById(id, { relations: ["roles"] });
    const role = await this.roleService.findOne({ where: { name } });

    if (user.roles.some(userRole => userRole.id === role.id)) {
      throw new BadRequestException("The user already has this role");
    }

    user.roles.push(role);
    await user.save();

    this.req["user"] = user.roles;

    return {
      message: "Role added!"
    };
  }

  async removeRole(id: number, name: string) {
    const user = await this.findOneById(id, {
      relations: ["roles"]
    });
    const role = await this.roleService.findOne({ where: { name } });

    const index = user.roles.findIndex(userRole => userRole.id === role.id);
    if (index < 0) {
      throw new BadRequestException("The user does not have this role");
    }

    user.roles.splice(index, 1);
    await user.save();

    this.req["user"] = user.roles;

    return {
      message: "Role removed!"
    };
  }

  async checkUser(user: Partial<User>) {
    if (user.email && (await this.userRepo.findOneBy({ email: user.email }))) {
      throw new BadRequestException("The email already is taken!");
    }

    if (
      user.username &&
      (await this.userRepo.findOneBy({ username: user.username }))
    ) {
      throw new BadRequestException("The username already is taken!");
    }

    return user;
  }
}
