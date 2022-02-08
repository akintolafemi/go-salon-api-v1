import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ResponseManager, standardResponse, metaData } from '@utils/response-manager.utils';
import { PrismaService } from 'src/prisma.service';
import RequestWithUser from 'src/types/request-with-user.types';
import GlobalQueryDto from '@dtos/GlobalQueryDto';
import { extractSimpleCommonVariablesForPrismaQueryUtils } from '@utils/extract-common-variables-for-prisma.query.utils';
import { RequestCreateReviewDto } from './dtos/reviews.dto';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsService {
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async getReviewsBySalon(salonid: number, queryDto: GlobalQueryDto): Promise<standardResponse> {

    const { page, limit } =
      await extractSimpleCommonVariablesForPrismaQueryUtils(queryDto, this.request);

    const totalResultsCount = await this.prismaService.reviews.aggregate({
      _count: {
        id: true,
      },
      where: { salonid: salonid, deleted: 0 },
    });

    const results = await this.prismaService.reviews.findMany({
      where: { salonid: salonid, deleted: 0 },
      skip: (page - 1) * limit || 0,
      take: limit || 20,
      orderBy: {
        datecreated: 'desc'
      },
      select: {
        id: true,
        ownerid: true,
        note: true,
        ratings: true,
        users: {
          select: {
            userid: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            avatar: true,
          }
        },
        datecreated: true,
        dateupdated: true,
        datedeleted: true,
        deleted: true,
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

    return ResponseManager.paginatedResponse("success", HttpStatus.OK, "reviews result", meta, results);
  }

  public async createReview(createReview: RequestCreateReviewDto): Promise<standardResponse> {

    try {
      
      const salon = await this.prismaService.reviews.create({
        data: {
          ownerid: this.request.user.userid,
          ...createReview
        }
      });

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `review created successfully`, salon);

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `review creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
