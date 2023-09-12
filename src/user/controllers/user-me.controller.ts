import { UserService } from "../user.service";
import { Auth } from "@/auth/auth.decorator";
import { Body, Controller, Delete, Get, Patch } from "@nestjs/common";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Auth()
@Controller("users/me")
export class UserMeController {
  constructor(private userService: UserService) {}

  @Get()
  async me() {
    return await this.userService.findMe();
  }

  @Patch()
  async update(@Body() updateDto: UpdateUserDto) {
    const user = await this.userService.findMe();
    return this.userService.update(user.id, updateDto);
  }

  @Delete()
  async delete() {
    const user = await this.userService.findMe();
    return this.userService.delete(user.id);
  }
}
