import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import JwtGuard from '@auth//jwt.guard';
import { updatePasswordDto, passwordRetrieveDto, resetPasswordDto } from './dtos/auth.dtos';

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  public async login() {
    return this.authService.signWithJWT();
  }

  @UseGuards(JwtGuard)
  @Post("/updatepassword")
  public async updatePassword(@Body() updatePasswordReq: updatePasswordDto) {
    return this.authService.updatePassword(updatePasswordReq);
  }

  @Post("/retrivepassword")
  public async sendPasswordRetrivalLink(@Body() passwordRetrieve: passwordRetrieveDto) {
    return this.authService.sendPasswordRetrivalLink(passwordRetrieve);
  }

  @Post("/resetpassword/:yourKey")
  public async resetPassword(@Param("yourKey") yourKey: string, @Body() resetPasswordReq: resetPasswordDto) {
    return this.authService.resetPassword(yourKey, resetPasswordReq);
  }
}
