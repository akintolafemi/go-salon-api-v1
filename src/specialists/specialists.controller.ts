import { Controller, Body, Post, Patch, UseGuards, Param, SetMetadata } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { UsersService } from '@users/users.service';
import { CreateSpecialistDto, UpdateSpecialistDto, UpdateSpecialistStatusDto } from './dtos/specialists.dto';
import JwtGuard from '@auth/JwtGuard';
import AccountTypeGuard from '@decorators/AccountTypeGuard';
import CheckSalonGuard from '@decorators/CheckSalonGuard';
import CheckSpecialistGuard from '@decorators/CheckSpecialistGuard';

@Controller('api/v1/specialists')
export class SpecialistsController {
  constructor(private readonly specialistsService: SpecialistsService, private readonly usersService: UsersService) {}

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, AccountTypeGuard, CheckSalonGuard)
  @Post("/create")
  public async createSpecialist(@Body() createRequest: CreateSpecialistDto) {
    return this.specialistsService.createSpecialist(createRequest);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, CheckSpecialistGuard)
  @Patch("/:id")
  public async updateSpecialist(@Body() updateRequest: UpdateSpecialistDto) {
    return this.specialistsService.updateSpecialist(updateRequest);
  }

  @SetMetadata('accounttypeids', [1, 4, 5])
  @UseGuards(JwtGuard, CheckSpecialistGuard)
  @Patch("/updatestatus/:id")
  public async updateSpecialistStatus(@Param("id") id: string, @Body() updateRequest: UpdateSpecialistStatusDto) {
    return this.usersService.updateAccountStatus(Number(id), updateRequest);
  }
}
