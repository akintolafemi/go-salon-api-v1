import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { paginatedResponse, ResponseManager, standardResponse, metaData } from "@utils/response-manager.utils";
import { LocationDto, UpdateLocationDto } from "./dtos/locations.dto";
import { LocationsQueryDto } from "./dtos/locations.query.dtos";
import { extractCommonVariablesForPrismaQueryUtils, extractSelectedVariablesForPrismaQueryUtils } from "@utils/extract-common-variables-for-prisma.query.utils";
import { getCorrectObject } from "@utils/get-correct-object.utils";
import { validQueryFieldsForLocations } from "@constants/locations.constants";

@Injectable({ scope: Scope.REQUEST })
export class LocationsService {

  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async createLocation(createRequest: LocationDto): Promise<standardResponse> {
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

  public async deleteLocation(id: number): Promise<standardResponse> {
    try {
      
      await this.prismaService.locations.update({
        where: { id: id },
        data: {
          deleted: 1,
          datedeleted: new Date(),
        }
      });
      return ResponseManager.standardResponse("success", HttpStatus.OK, `location deleted sucessfully`, null);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `location delete failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateLocation(id: number, updateReq: UpdateLocationDto): Promise<standardResponse> {

    if (Object.keys(updateReq).length === 0) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `no data to update`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      
      const getLocation = await this.prismaService.locations.findUnique({
        where: { id: id }
      });

      if (!getLocation) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `location not found`, null),
          HttpStatus.NOT_FOUND,
        );
      }

      const updated = { ...getLocation, ...updateReq, dateupdated: new Date() };

      const doUpdate = await this.prismaService.locations.update({
        where: { id: id },
        data: updated
      });

      const final = {
        currentData: getLocation,
        updatedData: doUpdate
      }

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `location details updated successfully`, final);
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating location details, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getLocationById(id: number): Promise<standardResponse> {
    const result = await this.prismaService.locations.findUnique({
      where: { id: id },
      select: {
        id: true,
        salonid: true,
        address: true,
        cityid: true,
        stateid: true,
        googlelocation: true,
        datecreated: true,
        dateupdated: true,
        datedeleted: true,
        cities: true,
        states: true,
        _count: true,
        salons: {
          select: {
            ownerid: true,
            salontypeid: true,
            name: true,
            alias: true,
            description: true,
            logouri: true,
            ratings: true,
            officialemail: true,
            datecreated: true,
          }
        }
      },
    });

    if (!result) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `location not found`, null),
        HttpStatus.NOT_FOUND,
      );
    }
    return ResponseManager.standardResponse("success", HttpStatus.OK, `location found`, result);
  }

  public async getLocations(locationsQueryDto: LocationsQueryDto): Promise<paginatedResponse> {
    const { globalQuery, orderByQuery, page, fromDate, toDate, limit } =
      await extractCommonVariablesForPrismaQueryUtils(locationsQueryDto, this.request);

    const locationQuery = getCorrectObject(validQueryFieldsForLocations, locationsQueryDto);

    var selectedQuery = null;
    if (this.request.user.accounttypeid === 3 || this.request.user.accounttypeid === 5)
      selectedQuery = await extractSelectedVariablesForPrismaQueryUtils(locationsQueryDto);
    else 
      selectedQuery = { deleted: 0 };
    
    const totalResultsCount = await this.prismaService.locations.aggregate({
      _count: {
        id: true,
      },
      where: {
        AND: [
          locationQuery,
          {
            states: {
              name: globalQuery["state"],
            },
            cities: {
              name: globalQuery["city"]
            },
            datecreated: { gte: fromDate, lt: toDate },
          },
          selectedQuery
        ],
      },
    });

    const results = await this.prismaService.locations.findMany({
      where: {
        AND: [
          locationQuery,
          {
            states: {
              name: globalQuery["state"],
            },
            cities: {
              name: globalQuery["city"]
            },
            datecreated: { gte: fromDate, lt: toDate },
          },
          selectedQuery
        ],
      },
      skip: (page - 1) * limit || 0,
      take: limit || 50,
      orderBy: orderByQuery,
      select: {
        id: true,
        salonid: true,
        address: true,
        cityid: true,
        stateid: true,
        googlelocation: true,
        datecreated: true,
        dateupdated: true,
        datedeleted: true,
        deleted: true,
        cities: true,
        states: true,
        _count: true,
        salons: {
          select: {
            ownerid: true,
            salontypeid: true,
            name: true,
            alias: true,
            description: true,
            logouri: true,
            ratings: true,
            officialemail: true,
            datecreated: true,
          }
        },
      },
    });

    const totalRows = totalResultsCount._count.id;
    const rowsPerPage = limit || 50;
    const meta: metaData = {
      rowsReturned: results.length,
      totalRows,
      rowsPerPage,
      totalPages: Math.ceil(totalRows / rowsPerPage),
      currentPage: page || 1,
    };

    return ResponseManager.paginatedResponse("success", HttpStatus.OK, "locations result", meta, results);
  }
}
