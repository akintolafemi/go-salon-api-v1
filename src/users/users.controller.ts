import { Controller, Post, Get, Put, Patch, Delete, Body, UseGuards, SetMetadata, Param } from '@nestjs/common';
import AccountTypeGuard from '@decorators/account.types.decorator';
import { UsersService } from './users.service';
import { createAccountDto, confirmAccountDto, updateUserStatusDto, updateProfileDto } from './dtos/users.dto';
import JwtGuard from '@auth/jwt.guard';

@Controller("api/v1/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/create")
  public async createAccount(@Body() createRequest: createAccountDto) {
    return this.usersService.createAccount(createRequest);
  }

  @UseGuards(JwtGuard)
  @Get("/:userid")
  public async getUserByUserId(@Param("userid") userid: number) {
    return this.usersService.getUserByUserId(Number(userid));
  }

  @Post("/confirm/:email/:token")
  public async confirmAccount(@Param("email") email: string, @Param("token") token: string) {
    return this.usersService.confirmAccount({email, token});
  }

  @SetMetadata('accounttypeids', [4, 5])
  @UseGuards(JwtGuard)
  @Patch("/updatestatus/:userid")
  public async updateAccountStatus(@Param("userid") userid: string, @Body() updateRequest: updateUserStatusDto) {
    return this.usersService.updateAccountStatus(Number(userid), updateRequest);
  }

  @SetMetadata('accounttypeids', [5])
  @UseGuards(JwtGuard)
  @Delete("/:userid")
  public async deactivateAccount(@Param("userid") userid: string) {
    return this.usersService.deactivateAccount(Number(userid));
  }

  @UseGuards(JwtGuard)
  @Patch("/:userid")
  public async updateProfile(@Param("userid") userid: string, @Body() updateRequest: updateProfileDto) {
    return this.usersService.updateProfile(Number(userid), updateRequest);
  }

}
