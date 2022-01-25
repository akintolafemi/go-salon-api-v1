import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import JwtGuard from '@auth//jwt.guard';

@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  public async login() {
    return this.authService.signWithJWT();
  }
}
