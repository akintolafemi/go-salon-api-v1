import { IsNotEmpty, IsOptional, IsEmail, IsString, IsMobilePhone, IsInt, MinLength, IsIn, IsAlphanumeric, IsUrl } from "class-validator";
import { accountStatusTypes } from "@constants/global.constants";

export class AccountDto {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;
  
  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  othernames: string;

  @IsOptional()
  @IsMobilePhone("en-NG")
  mobile: string;

  @IsOptional()
  @IsString()
  homeaddress: string;
}

export class CreateAccountDto extends AccountDto{
  @IsInt()
  @IsNotEmpty()
  @IsIn([1, 2, 3])
  accounttypeid: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be a minimum of 8 alphanumeric characters'
  })
  @IsAlphanumeric("en-US", {
    message: 'Password must be alphanumeric'
  })
  password: string;
}

export class ConfirmAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsIn(accountStatusTypes)
  @IsString()
  status: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstname: string;
  
  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  othernames: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsMobilePhone("en-NG")
  mobile: string;

  @IsOptional()
  @IsString()
  homeaddress: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}