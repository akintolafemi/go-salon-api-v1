import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { ResponseManager, standardResponse } from "@utils/response-manager.utils";
import { locationDto } from "./dtos/locations.dto";

@Injectable({ scope: Scope.REQUEST })
export class LocationsService {

  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async createLocation(createRequest: locationDto): Promise<standardResponse> {
    try {
      const create = await this.prismaService.locations.create({
        data: {
          salonid: this.request.user.salonid,
          ...createRequest,
        }
      });
      return ResponseManager.standardResponse("success", HttpStatus.OK, `location created sucessfully`, create);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `location creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
