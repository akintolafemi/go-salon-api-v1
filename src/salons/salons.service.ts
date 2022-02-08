import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { SalonDto, SalonupdateDto, AddServicesDto } from "./dtos/salons.dto";
import { SalonsQueryDto } from "./dtos/salons.query.dtos";
import { paginatedResponse, ResponseManager, standardResponse, metaData } from "@utils/response-manager.utils";
import { extractCommonVariablesForPrismaQueryUtils, extractSelectedVariablesForPrismaQueryUtils } from "@utils/extract-common-variables-for-prisma.query.utils";
import { getCorrectObject } from "@utils/get-correct-object.utils";
import { validQueryFieldsForSalons } from "@constants/salons.constants";

@Injectable({ scope: Scope.REQUEST })
export class SalonsService {
  
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async createSalon(salonReg: SalonDto): Promise<standardResponse> {

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

  public async updateSalon(id: number, updateRequest: SalonupdateDto): Promise<standardResponse> {

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
        users_salonsTousers_salonid: {
          select: {
            userid: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            avatar: true,
          }
        },   //all users in salon
        // users_salons_owneridTousers: true,   owner data
        locations: {
          where: {
            deleted: 0,
          },
          select: {
            id: true,
            address: true,
            googlelocation: true,
          }
        },
        salonservices: {
          where: {
            deleted: 0,
          },
          select: {
            services: {
              select: {
                title: true,
                description: true,
              }
            }
          }
        },
        salonspecials: {
          where: {
            deleted: 0,
          },
          select: {
            special: true,
            description: true,
            cost: true,
            discount: true,
            status: true,
            validity: true
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

  public async addServices(createReq: AddServicesDto): Promise<standardResponse> {

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

  public async getSalonsByOwnerId(ownerid: number): Promise<standardResponse> {
    const result = await this.prismaService.salons.findMany({
      where: { ownerid: ownerid },
      select: {
        id: true,
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
        users_salonsTousers_salonid: {
          select: {
            userid: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            avatar: true,
          }
        },   //all users in salon
        // users_salons_owneridTousers: true,   owner data
        locations: {
          where: {
            deleted: 0,
          },
          select: {
            id: true,
            address: true,
            googlelocation: true,
          }
        },
        salonservices: {
          where: {
            deleted: 0,
          },
          select: {
            services: {
              select: {
                title: true,
                description: true,
              }
            }
          }
        },
        salonspecials: {
          where: {
            deleted: 0,
          },
          select: {
            special: true,
            description: true,
            cost: true,
            discount: true,
            status: true,
            validity: true
          }
        },
        salontypes: true,
        _count: true,
      },
    });

    if (!result) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `salon not found for owner id ${ownerid}`, null),
        HttpStatus.NOT_FOUND,
      );
    }
    return ResponseManager.standardResponse("success", HttpStatus.OK, `${result.length} salon(s) found for owner id ${ownerid}`, result);
  }

  public async getSalons(salonsQueryDto: SalonsQueryDto): Promise<paginatedResponse> {
    const { globalQuery, orderByQuery, page, fromDate, toDate, limit } =
      await extractCommonVariablesForPrismaQueryUtils(salonsQueryDto, this.request);

    const salonsQuery = getCorrectObject(validQueryFieldsForSalons, salonsQueryDto);

    var selectedQuery = null;
    if (this.request.user.accounttypeid === 3 || this.request.user.accounttypeid === 5)
      selectedQuery = await extractSelectedVariablesForPrismaQueryUtils(salonsQueryDto);
    else 
      selectedQuery = { deleted: 0 };
    
    //forsalon ? aggregateArray.unshift({ salonid: this.request.user.salonid }) : null;

    const totalResultsCount = await this.prismaService.salons.aggregate({
      _count: {
        id: true,
      },
      where: {
        AND: [
          salonsQuery,
          {
            ratings: globalQuery["ratings"],
            datecreated: { gte: fromDate, lt: toDate },
          },
          selectedQuery
        ],
      },
    });

    const results = await this.prismaService.salons.findMany({
      where: {
        AND: [
          salonsQuery,
          {
            ratings: globalQuery["ratings"],
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
        users_salonsTousers_salonid: {
          select: {
            userid: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            avatar: true,
          }
        },   //all users in salon
        // users_salons_owneridTousers: true,   owner data
        locations: {
          where: {
            deleted: 0,
          },
          select: {
            id: true,
            address: true,
            googlelocation: true,
          }
        },
        salonservices: {
          where: {
            deleted: 0,
          },
          select: {
            services: {
              select: {
                title: true,
                description: true,
              }
            }
          }
        },
        salonspecials: {
          where: {
            deleted: 0,
          },
          select: {
            special: true,
            description: true,
            cost: true,
            discount: true,
            status: true,
            validity: true
          }
        },
        salontypes: true,
        _count: true,
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

    return ResponseManager.paginatedResponse("success", HttpStatus.OK, "salons result", meta, results);
  }
}
