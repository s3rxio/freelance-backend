import { TimestampableEntity } from "@/common/entities/timestampable.entity";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
