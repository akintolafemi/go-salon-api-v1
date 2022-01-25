import { SetMetadata, HttpException, HttpStatus, Inject, Scope } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import RequestWithUser from 'src/types/request-with-user.types';
import { REQUEST } from "@nestjs/core";
import { PrismaService } from 'src/prisma.service';
import { ResponseManager } from '@utils/response-manager.utils';

// export const AccountTypes = (...typeids: number[]) => SetMetadata('typeids', typeids);

@Injectable({ scope: Scope.REQUEST })
export default class CheckSalonGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService, @Inject(REQUEST) private request: RequestWithUser) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const salon = await this.prismaService.salons.findFirst({
      where: {ownerid: this.request.user.userid}
    });

    if (!salon) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `salon does not exit`, null),
        HttpStatus.NOT_FOUND,
      );
    }

    if (salon.status !== "active") {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.UNAUTHORIZED, `your salon status is set to ${salon.status}`, null),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}