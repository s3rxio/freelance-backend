import { AuthService } from "./auth.service";
import { Body, Controller, Post } from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { CreateUserDto } from "@/user/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/sign-in")
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post("/sign-up")
  async signUp(@Body() createDto: CreateUserDto) {
    return this.authService.signUp(createDto);
  }
}
