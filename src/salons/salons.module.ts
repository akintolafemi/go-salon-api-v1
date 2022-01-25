import { Module } from '@nestjs/common';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';
import { AuthModule } from '@auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    AuthModule
  ],
  controllers: [
    SalonsController
  ],
  providers: [
    SalonsService,
    PrismaService
  ]
})
export class SalonsModule {}
