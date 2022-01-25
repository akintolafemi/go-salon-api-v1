import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ResponseManager } from "@utils/response-manager.utils";
import { PrismaService } from "../prisma.service";

@Injectable()
export class CreateAccountMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //check that request is valid
    const { username } = req.body;

    const login = await this.prismaService.logins.findUnique({
      where: {username: username}
    });

    if (login) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `username/email has already been chosen`, null),
        HttpStatus.BAD_REQUEST,
      );
    }
    
    next();
  }
}
