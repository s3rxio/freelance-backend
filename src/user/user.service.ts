import { CrudService } from "@/common/crud/crud.service";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {
    super(userRepo);
  }

  async create(createDto: CreateUserDto) {
    const user = this.userRepo.create(createDto);
    await this.checkUser(user);

    try {
      return this.userRepo.save(user);
    } catch (err) {
      Logger.error(err);
      throw new BadRequestException(err.details);
    }
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
    const ids = (await this.findMany({ select: ["id"] })).map(user => user.id);
    if (ids.length <= 0) {
      throw new NotFoundException("So and so there are no users!");
    }
    return await this.userRepo.delete(ids);
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
