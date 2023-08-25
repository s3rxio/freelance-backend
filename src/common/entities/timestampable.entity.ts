import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class TimestampableEntity extends BaseEntity {
  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
