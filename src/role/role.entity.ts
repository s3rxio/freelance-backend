import { TimestampableEntity } from "@/common/entities/timestampable.entity";
import { User } from "@/user/user.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("roles")
export class Role extends TimestampableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, user => user.roles)
  @JoinTable()
  users: User[];
}
