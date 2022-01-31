import { Module } from '@nestjs/common';
import { SpecialistsController } from './specialists.controller';
import { SpecialistsService } from './specialists.service';
import { AuthModule } from '@auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '@users/users.service';

@Module({
  imports: [
    AuthModule
  ],
  controllers: [
    SpecialistsController
  ],
  providers: [
    SpecialistsService,
    PrismaService,
    UsersService
  ]
})
export class SpecialistsModule {}
