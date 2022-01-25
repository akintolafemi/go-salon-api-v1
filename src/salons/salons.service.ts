import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { salonDto } from "./dtos/salons.dto";
import { createSpecialistDto } from "@users/dtos/users.dto";
import { ResponseManager, standardResponse } from "@utils/response-manager.utils";

@Injectable({ scope: Scope.REQUEST })
export class SalonsService {
  
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async createSalon(salonReg: salonDto): Promise<standardResponse> {

    try {
      
      const salon = await this.prismaService.salons.create({
        data: {
          ownerid: this.request.user.userid,
          ...salonReg
        }
      });

      await this.prismaService.users.update({
        where: {userid: this.request.user.userid},
        data: {
          salonid: salon.id,
          accounttypeid: 1
        }
      });

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `salon created with account upgraded to a salon owner`, salon);

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `salon creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createSpecialist(createSpecialistRequest: createSpecialistDto): Promise<standardResponse> {

    try {

      const createLogin = await this.prismaService.logins.create({
        data: {
          username: createSpecialistRequest.username,
          password: 'empty',
          status: 'pending verification'
        }
      });
      if (createLogin) {
        const email = createSpecialistRequest.username;
        const salondId = createSpecialistRequest.salonid ? createSpecialistRequest.salonid : this.request.user.salonid;
        delete createSpecialistRequest["username"];
        const createUser = await this.prismaService.users.create({
          data: { 
            userid: createLogin.id,
            email: email,
            ...createSpecialistRequest, 
            salonid: salondId,
          }
        });

        return ResponseManager.standardResponse("success", HttpStatus.CREATED, `specialist account created`, { ...createUser, username: email, status: createLogin.status});
      }
      else {
        return ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to create specialist account`, null);
      }

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `specialist account creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
