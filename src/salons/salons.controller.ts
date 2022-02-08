import { Controller, Body, Post, Get, Put, Patch, UseGuards, Param, SetMetadata, Query } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { SalonDto, SalonupdateDto, AddServicesDto } from './dtos/salons.dto';
import { SalonsQueryDto } from './dtos/salons.query.dtos';
import JwtGuard from '@auth/JwtGuard';
import AccountTypeGuard from '@decorators/AccountTypeGuard';
import CheckSalonGuard from '@decorators/CheckSalonGuard';

@Controller("api/v1/salons")
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @UseGuards(JwtGuard)
  @Get("/")
  public async getSalons(@Query() salonsQueryDto: SalonsQueryDto) {
    return this.salonsService.getSalons(salonsQueryDto);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard)
  @Post("/create")
  public async createSalon(@Body() request: SalonDto) {
    return this.salonsService.createSalon(request);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard, CheckSalonGuard)
  @Patch("/:id")
  public async updateSalon(@Param("id") id: string, @Body() updateRequest: SalonupdateDto) {
    return this.salonsService.updateSalon(Number(id), updateRequest);
  }

  @UseGuards(JwtGuard)
  @Get("/:id")
  public async getSalonById(@Param("id") id: string) {
    return this.salonsService.getSalonById(Number(id));
  }

  @UseGuards(JwtGuard)
  @Put("/addservices")
  public async addServices(@Body() createReq: AddServicesDto) {
    return this.salonsService.addServices(createReq);
  }

  @UseGuards(JwtGuard)
  @Get("owner/:ownerid")
  public async getSalonsByOwnerId(@Param("ownerid") ownerid: string) {
    return this.salonsService.getSalonsByOwnerId(Number(ownerid));
  }
  
}
