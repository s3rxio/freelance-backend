import { NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { Repository, FindManyOptions, FindOneOptions } from "typeorm";
import { BaseMessage } from "./base-message.enum";
import { BaseEntity } from "./base.entity";

export abstract class BaseService<TEntity extends BaseEntity> {
  constructor(private readonly repository: Repository<TEntity>) {}

  async findAll() {
    return this.repository.find();
  }

  async findMany(options?: FindManyOptions<TEntity>) {
    const records = this.repository.find(options);

    if (!records) {
      throw new NotFoundException(BaseMessage.NOT_FOUND);
    }

    return records;
  }

  async findOne(options: FindOneOptions<TEntity>) {
    try {
      const record = this.repository.findOne(options);
      if (!record) {
        throw new NotFoundException(BaseMessage.NOT_FOUND);
      }

      return record;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOneById(id: TEntity["id"], options?: FindOneOptions<TEntity>) {
    const record = await this.repository.findOne({
      ...options,
      where: {
        id,
        ...(options?.where || {})
      }
    } as FindOneOptions<TEntity>);

    if (!record) {
      throw new NotFoundException(BaseMessage.NOT_FOUND);
    }

    return record;
  }

  async update(id: TEntity["id"], partialEntity: Partial<TEntity>) {
    const entity = await this.findOneById(id);

    Object.assign(entity, partialEntity);

    try {
      return await this.repository.save(entity);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async delete(id: number) {
    const user = await this.findOneById(id);

    try {
      return await this.repository.remove(user);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(BaseMessage.NOT_FOUND, error);
    }
  }
}
