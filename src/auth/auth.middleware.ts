import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ResponseManager } from "@utils/response-manager.utils";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //check that request is valid
    const { username, password } = req.body;
    if (!username || !password) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `username or password is invalid`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    //get user by username
    const user = await this.prismaService.logins.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        lastlogin: true,
        status: true,
        users: true,
      }
    });

    //throw error if no matching user is found
    if (!user) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.FORBIDDEN, `username is invalid`, null),
        HttpStatus.FORBIDDEN,
      );
    }

    //check user status
    if (user.status !== "active") {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.FORBIDDEN, `account is ${user.status}`, null),
        HttpStatus.FORBIDDEN,
      );
    }

    //validate password
    const passwordsMatch = await bcrypt.compare(password, user.password);
    //throw error if passwords do not match
    if (!passwordsMatch) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", 401, `Invalid credentials provided`, null),
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user) {
      await this.prismaService.logins.update({
        where: {
          id: user.id,
        },
        data: { islogin: 1, lastlogin: new Date() }
      })
    }

    //attach user to request
    req["user"] = { ...user.users, username: user.username, lastlogin: user.lastlogin, status: user.status };
    next();
  }
}
