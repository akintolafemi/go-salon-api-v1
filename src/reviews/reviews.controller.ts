import JwtGuard from '@auth/JwtGuard';
import GlobalQueryDto from '@dtos/GlobalQueryDto';
import { Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { RequestCreateReviewDto } from './dtos/reviews.dto';
import AccountTypeGuard from '@decorators/AccountTypeGuard';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtGuard)
  @Get("/:salonid")
  public async getReviewsBySalon(@Param("salonid") salonid: string, @Query() queryDto: GlobalQueryDto) {
    return this.reviewsService.getReviewsBySalon(Number(salonid), queryDto);
  }

  @SetMetadata('accounttypeids', [1])
  @UseGuards(JwtGuard, AccountTypeGuard)
  @Post("/create")
  public async createReview(@Body() createReview: RequestCreateReviewDto) {
    return this.reviewsService.createReview(createReview);
  }

}
