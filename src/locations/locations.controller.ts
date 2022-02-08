import { Controller, Body, Post, Get, UseGuards, SetMetadata, Delete, Param, Patch, Query } from '@nestjs/common';
import JwtGuard from '@auth/JwtGuard';
import { LocationsService } from './locations.service';
import { LocationDto, UpdateLocationDto } from './dtos/locations.dto';
import AccountTypeGuard from '@decorators/AccountTypeGuard';
import CheckSalonGuard from '@decorators/CheckSalonGuard';
import { LocationsQueryDto } from './dtos/locations.query.dtos';

@Controller("api/v1/locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @UseGuards(JwtGuard)
  @Get("/")
  public async getLocations(@Query() locationsQueryDto: LocationsQueryDto) {
    return this.locationsService.getLocations(locationsQueryDto);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard, CheckSalonGuard)
  @Post("/create")
  public async createLocation(@Body() createRequest: LocationDto) {
    return this.locationsService.createLocation(createRequest);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard)
  @Delete("/:id")
  public async deleteLocation(@Param("id") id: string) {
    return this.locationsService.deleteLocation(Number(id));
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard)
  @Patch("/:id")
  public async updateLocation(@Param("id") id: string, @Body() updateReq: UpdateLocationDto) {
    return this.locationsService.updateLocation(Number(id), updateReq);
  }

  @UseGuards(JwtGuard)
  @Get("/:id")
  public async getLocationById(@Param("id") id: string) {
    return this.locationsService.getLocationById(Number(id));
  }


}
