import { Controller, Body, Post, Get, Put, UseGuards, SetMetadata } from '@nestjs/common';
import JwtGuard from '@auth/jwt.guard';
import { LocationsService } from './locations.service';
import { locationDto } from './dtos/locations.dto';
import AccountTypeGuard from '@decorators/account.types.decorator';
import CheckSalonGuard from '@decorators/check.salon.decorator';

@Controller("api/v1/locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard, CheckSalonGuard)
  @Post("/create")
  public async createLocation(@Body() createRequest: locationDto) {
    return this.locationsService.createLocation(createRequest);
  }
}
