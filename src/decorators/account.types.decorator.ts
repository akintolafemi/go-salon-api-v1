import { SetMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ResponseManager } from '@utils/response-manager.utils';

// export const AccountTypes = (...typeids: number[]) => SetMetadata('typeids', typeids);

@Injectable()
export default class AccountTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const accounttypeids = this.reflector.get<number[]>('accounttypeids', context.getHandler());
    // if (!accounttypeids) {
    //   return true;
    // }
    // const request = context.switchToHttp().getRequest();
    // const accounttypeid = request.user.accounttypeid;

    // if (!accounttypeids.includes(Number(accounttypeid))) {
    //   throw new HttpException(
    //     ResponseManager.standardResponse("fail", HttpStatus.FORBIDDEN, `you are not allowed to access the resource`, null),
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    return true;
  }
}