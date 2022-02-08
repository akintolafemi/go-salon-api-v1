import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { AuthModule } from '@auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    AuthModule
  ],
  controllers: [
    ReviewsController
  ],
  providers: [
    ReviewsService,
    PrismaService
  ]
})
export class ReviewsModule {}
