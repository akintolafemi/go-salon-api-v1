import { Controller, Body, Post, Get, Put, UseGuards, SetMetadata } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { salonDto } from './dtos/salons.dto';
import { createSpecialistDto } from '@users/dtos/users.dto';
import JwtGuard from '@auth/jwt.guard';
import AccountTypeGuard from '@decorators/account.types.decorator';
import CheckSalonGuard from '@decorators/check.salon.decorator';

@Controller("api/v1/salons")
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard)
  @Post("/create")
  public async createSalon(@Body() request: salonDto) {
    return this.salonsService.createSalon(request);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard, CheckSalonGuard)
  @Post("/createspecialist")
  public async createSpecialist(@Body() createRequest: createSpecialistDto) {
    return this.salonsService.createSpecialist(createRequest);
  }
}
