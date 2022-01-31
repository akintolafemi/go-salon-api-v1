import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { salonDto, salonupdateDto, createSpecialistDto, salonIdDto, addServicesDto, updateSpecialistDto } from "./dtos/salons.dto";
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

  public async updateSalon(id: number, updateRequest: salonupdateDto): Promise<standardResponse> {

    //check if body has data
    if (Object.keys(updateRequest).length === 0) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `no data to update`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {

      const getSalon = this.request.otherData.salon;

      const updated = { ...getSalon, ...updateRequest, dateupdated: new Date() };

      const doUpdate = await this.prismaService.salons.update({
        where: { id: id },
        data: updated
      });

      const final = {
        currentData: getSalon,
        updatedData: doUpdate
      }

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `salon details updated successfully`, final);
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating salon details, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getSalonById(id: number): Promise<standardResponse> {
    const result = await this.prismaService.salons.findUnique({
      where: { id: id },
      select: {
        id: true,
        ownerid: true,
        salontypeid: true,
        name: true,
        alias: true,
        description: true,
        logouri: true,
        ratings: true,
        officialemail: true,
        datecreated: true,
        dateupdated: true,
        datedeleted: true,
        deleted: true,
        status: true,
        locations: {
          select: {
            id: true,
            address: true,
            googlelocation: true,
          }
        },
        salonservices: {
          select: {
            services: {
              select: {
                title: true,
                description: true,
              }
            }
          }
        },
        salontypes: true,
        _count: true,
      },
    });

    if (!result) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `salon not found`, null),
        HttpStatus.NOT_FOUND,
      );
    }
    return ResponseManager.standardResponse("success", HttpStatus.OK, `salon found`, result);
  }

  public async addServices(createReq: addServicesDto): Promise<standardResponse> {

    try {

      const arrServices = [];
      createReq.serviceids.forEach(serviceid => {
        arrServices.push({
          serviceid: serviceid,
          salonid: this.request.user.salonid
        });
      });

      await this.prismaService.salonservices.createMany({
        data: arrServices
      });

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `${arrServices.length} services added successfully`, null);
      
    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `specialist account creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
