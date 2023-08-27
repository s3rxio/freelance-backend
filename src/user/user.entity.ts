import { TimestampableEntity } from "@/common/entities/timestampable.entity";
import { Role } from "@/role/role.entity";
import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("users", {
  orderBy: {
    id: "ASC"
  }
})
export class User extends TimestampableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];
}
