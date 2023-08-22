import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from "@nestjs/common";
import { BaseEntity } from "./base.entity";
import { BaseService } from "./base.service";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseController<TEntity extends BaseEntity> {
  constructor(private readonly service: BaseService<TEntity>) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  async findOneById(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOneById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() entity: TEntity) {
    return this.service.create(entity);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() partialEntity: QueryDeepPartialEntity<TEntity>
  ) {
    return this.service.update(id, partialEntity);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
