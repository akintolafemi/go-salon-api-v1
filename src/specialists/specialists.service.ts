import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { CreateSpecialistDto, UpdateSpecialistDto } from "./dtos/specialists.dto";
import { ResponseManager, standardResponse } from "@utils/response-manager.utils";
import { randomChar } from "@utils/random-utils";

@Injectable({ scope: Scope.REQUEST })
export class SpecialistsService {
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async createSpecialist(createSpecialistRequest: CreateSpecialistDto): Promise<standardResponse> {

    try {

      const tempPassword = randomChar(55);

      const createLogin = await this.prismaService.logins.create({
        data: {
          username: createSpecialistRequest.username,
          password: tempPassword,
          status: 'pending verification'
        }
      });
      if (createLogin) {
        const email = createSpecialistRequest.username;
        delete createSpecialistRequest["username"];
        const createUser = await this.prismaService.users.create({
          data: { 
            userid: createLogin.id,
            email: email,
            ...createSpecialistRequest, 
            salonid: this.request.user.salonid,
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

  public async updateSpecialist(updateRequest: UpdateSpecialistDto): Promise<standardResponse> {
    //check if body has data
    if (Object.keys(updateRequest).length === 0) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `no data to update`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      
      const specialist = this.request.otherData.specialist;

      const updated = { ...specialist, ...updateRequest, dateupdated: new Date() };

      const doUpdate = await this.prismaService.users.update({
        where: { userid: specialist.userid },
        data: updated
      });

      const final = {
        currentData: specialist,
        updatedData: doUpdate
      }

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `specialist details updated successfully`, final);
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating specialist details, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
