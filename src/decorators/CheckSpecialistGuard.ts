import { HttpException, HttpStatus, Inject, Scope, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import RequestWithUser from 'src/types/request-with-user.types';
import { REQUEST } from "@nestjs/core";
import { PrismaService } from 'src/prisma.service';
import { ResponseManager } from '@utils/response-manager.utils';

@Injectable({ scope: Scope.REQUEST })
export default class CheckSpecialistGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService, @Inject(REQUEST) private request: RequestWithUser) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const specialist = await this.prismaService.users.findFirst({
      where: { AND:[ { userid: Number(this.request['params']?.id), salonid: Number(this.request.user.salonid) } ] }
    });

    if (!specialist) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `specialist does not exit`, null),
        HttpStatus.NOT_FOUND,
      );
    }

    ///attach specialist to request
    Object.assign(request, {
      otherData: {
        specialist: specialist
      }
    });
    return true;
  }
}