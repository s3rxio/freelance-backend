import { NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere
} from "typeorm";
import { BaseMessage } from "./base-message.enum";
import { BaseEntity } from "./base.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

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
    const record = this.repository.findOne(options);

    if (!record) {
      throw new NotFoundException(BaseMessage.NOT_FOUND);
    }

    return record;
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

  async create(entity: TEntity) {
    const obj = await this.repository.create(entity);
    try {
      return await this.repository.save(obj);
    } catch (err) {
      Logger.error(err);
      throw new BadRequestException(err.detail);
    }
  }

  async update(
    criteria: TEntity["id"] | FindOptionsWhere<TEntity>,
    partialEntity: QueryDeepPartialEntity<TEntity>
  ) {
    try {
      return await this.repository.update(criteria, partialEntity);
    } catch (err) {
      Logger.error(err);
      throw new BadRequestException(err.detail);
    }
  }

  async delete(criteria: TEntity["id"] | FindOptionsWhere<TEntity>) {
    try {
      return await this.repository.delete(criteria);
    } catch (err) {
      Logger.error(err);
      throw new NotFoundException(BaseMessage.NOT_FOUND, err.detail);
    }
  }
}
