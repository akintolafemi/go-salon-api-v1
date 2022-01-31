import { Controller, Body, Post, Get, Put, Patch, UseGuards, Param, SetMetadata } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { salonDto, salonupdateDto, createSpecialistDto, addServicesDto, updateSpecialistDto } from './dtos/salons.dto';
import JwtGuard from '@auth/jwt.guard';
import AccountTypeGuard from '@decorators/account.types.decorator';
import CheckSalonGuard from '@decorators/check.salon.decorator';
import CheckSpecialistGuard from '@decorators/check.specialist.decorator';

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
  @Patch("/:id")
  public async updateSalon(@Param("id") id: string, @Body() updateRequest: salonupdateDto) {
    return this.salonsService.updateSalon(Number(id), updateRequest);
  }

  @UseGuards(JwtGuard)
  @Get("/:id")
  public async getSalonById(@Param("id") id: string) {
    return this.salonsService.getSalonById(Number(id));
  }

  @UseGuards(JwtGuard)
  @Put("/addservices")
  public async addServices(@Body() createReq: addServicesDto) {
    return this.salonsService.addServices(createReq);
  }
  
}
