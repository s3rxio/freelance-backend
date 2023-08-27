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
    try {
      const user = await this.userService.findOne({
        where: { username }
      });

      if (!bcrypt.compareSync(pass, user.password)) {
        throw null;
      }

      return {
        token: await this.generateToken(user)
      };
    } catch {
      throw new UnauthorizedException(
        "Your username or password is incorrect!"
      );
    }
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

  private async generateToken(user: User) {
    const payload = {
      id: user.id
    };

    return this.jwtService.sign(payload);
  }
}
