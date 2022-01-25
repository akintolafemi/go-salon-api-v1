import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "../types/request-with-user.types";
import { ResponseManager } from "@utils/response-manager.utils";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly jwtService: JwtService,
  ) {}

  async signWithJWT() {
    const payload = {
      sub: this.request.user.userid,
      username: this.request.username,
    };
    const token = this.jwtService.sign(payload);
    return ResponseManager.standardResponse("success", HttpStatus.CREATED, "authentication successful", { access_token: token });
  }

  verifyJWT(token: string) {
    let decodedToken = null;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.UNAUTHORIZED, `invalid JWT token`, null),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return decodedToken;
  }
}
