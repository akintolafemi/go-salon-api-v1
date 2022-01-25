import { Controller, Post, Get, Put, Patch, Body, UseGuards, SetMetadata, Param } from '@nestjs/common';
import AccountTypeGuard from '@decorators/account.types.decorator';
import { UsersService } from './users.service';
import { createAccountDto, createSpecialistDto, confirmAccountDto, } from './dtos/users.dto';
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

}
