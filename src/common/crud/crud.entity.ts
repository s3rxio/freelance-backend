import { BaseEntity, PrimaryGeneratedColumn } from "typeorm";

export class CrudEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
}
