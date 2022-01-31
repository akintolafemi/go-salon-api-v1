import { Controller, Body, Post, Get, Put, Patch, UseGuards, Param, SetMetadata } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { UsersService } from '@users/users.service';
import { createSpecialistDto, updateSpecialistDto, updateSpecialistStatusDto } from './dtos/specialists.dto';
import JwtGuard from '@auth/jwt.guard';
import AccountTypeGuard from '@decorators/account.types.decorator';
import CheckSalonGuard from '@decorators/check.salon.decorator';
import CheckSpecialistGuard from '@decorators/check.specialist.decorator';

@Controller('api/v1/specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService, private readonly usersService: UsersService) {}

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard, CheckSalonGuard)
  @Post("/create")
  public async createSpecialist(@Body() createRequest: createSpecialistDto) {
    return this.specialistsService.createSpecialist(createRequest);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, CheckSpecialistGuard)
  @Patch("/:id")
  public async updateSpecialist(@Body() updateRequest: updateSpecialistDto) {
    return this.specialistsService.updateSpecialist(updateRequest);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, CheckSpecialistGuard)
  @Patch("/updatestatus/:id")
  public async updateSpecialistStatus(@Param("id") id: string, @Body() updateRequest: updateSpecialistStatusDto) {
    return this.usersService.updateAccountStatus(Number(id), updateRequest);
  }
}
