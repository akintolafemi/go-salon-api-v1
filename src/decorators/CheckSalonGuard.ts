import { HttpException, HttpStatus, Inject, Scope, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import RequestWithUser from 'src/types/request-with-user.types';
import { REQUEST } from "@nestjs/core";
import { PrismaService } from 'src/prisma.service';
import { ResponseManager } from '@utils/response-manager.utils';

@Injectable({ scope: Scope.REQUEST })
export default class CheckSalonGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService, @Inject(REQUEST) private request: RequestWithUser) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //check if logged is super admin, search with only id, else, search with logged in userid and id
    const searchParam = this.request.user.accounttypeid === 5 ? 
                      { id: Number(this.request['params']?.id) } 
                      : 
                      { id: Number(this.request.user.salonid), ownerid: Number(this.request.user.userid) }

    const salon = await this.prismaService.salons.findFirst({
      where: { AND: [searchParam] }
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

    ///attach salon to request
    Object.assign(request, {
      otherData: {
        salon: salon
      }
    });
    return true;
  }
}