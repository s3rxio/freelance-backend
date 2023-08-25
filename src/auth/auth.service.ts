import { JwtService } from "@nestjs/jwt";
import { User } from "./../user/user.entity";
import { UserService } from "./../user/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "@/user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.userService.findOne({ where: { username } });
    if (!bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException(
        "Your username or password is incorrect!"
      );
    }

    return {
      token: await this.generateToken(user)
    };
  }

  async signUp(createDto: CreateUserDto) {
    const user = await this.userService.create({
      username: createDto.username,
      email: createDto.email,
      password: bcrypt.hashSync(createDto.password, 5)
    });

    return {
      token: await this.generateToken(user)
    };
  }

  private async generateToken(user: Partial<User>) {
    const payload = {
      username: user.username,
      email: user.email
    };

    return this.jwtService.sign(payload);
  }
}
