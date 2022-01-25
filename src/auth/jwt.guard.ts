import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ResponseManager } from "@utils/response-manager.utils";
import { PrismaService } from "../prisma.service";
import { AuthService } from "@auth/auth.service";

@Injectable()
export default class JwtGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService, private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    //check if auth header exists
    if (!request.headers.authorization) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `JWT token is absent`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    //get token from request
    const token = request.headers.authorization.split(" ")[1];
    if (!token) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.UNAUTHORIZED, `invalid JWT token`, null),
        HttpStatus.UNAUTHORIZED,
      );
    }

    //decode token
    const decodedToken = this.authService.verifyJWT(token);

    //get user
    const user = await this.prismaService.logins.findFirst({
      where: {
        AND: [{ 
          id: decodedToken.sub
        }, {
          username: decodedToken.username 
        }]
      },
      select: {
        id: true,
        username: true,
        lastlogin: true,
        status: true,
        users: true,
      }
    });
    
    if (!user) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.UNAUTHORIZED, `failed to verify JWT token`, null),
        HttpStatus.UNAUTHORIZED,
      );
    }

    //attach user to request
    request["user"] = { ...user.users, username: user.username, lastlogin: user.lastlogin, status: user.status };

    return true;
  }
}
