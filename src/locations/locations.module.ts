import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { AuthModule } from '@auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    AuthModule
  ],
  controllers: [
    LocationsController
  ],
  providers: [
    LocationsService,
    PrismaService
  ]
})
export class LocationsModule {}
