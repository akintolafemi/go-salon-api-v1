import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import JwtGuard from '@auth/JwtGuard';
import { UpdatePasswordDto, PasswordRetrieveDto, ResetPasswordDto } from './dtos/auth.dtos';

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  public async login() {
    return this.authService.signWithJWT();
  }

  @UseGuards(JwtGuard)
  @Post("/updatepassword")
  public async updatePassword(@Body() updatePasswordReq: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordReq);
  }

  @Post("/retrivepassword")
  public async sendPasswordRetrivalLink(@Body() passwordRetrieve: PasswordRetrieveDto) {
    return this.authService.sendPasswordRetrivalLink(passwordRetrieve);
  }

  @Post("/resetpassword/:yourKey")
  public async resetPassword(@Param("yourKey") yourKey: string, @Body() resetPasswordReq: ResetPasswordDto) {
    return this.authService.resetPassword(yourKey, resetPasswordReq);
  }
}
