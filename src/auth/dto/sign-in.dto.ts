import { CreateUserDto } from "@/user/dto/create-user.dto";
import { OmitType } from "@nestjs/mapped-types";

export class SignInDto extends OmitType(CreateUserDto, ["email"] as const) {}
