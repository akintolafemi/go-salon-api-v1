import { IsNotEmpty, IsOptional, IsEmail, IsString, IsMobilePhone, IsInt, MinLength, Matches, IsIn, IsNumber, IsAlphanumeric, IsUrl } from "class-validator";
import { Transform } from "class-transformer";
import { accountStatusTypes } from "@constants/global.constants";

export class accountDto {
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

export class createAccountDto extends accountDto{
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
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {message: 'password too weak, must contact at least one letter and one number'})
  password: string;
}

export class confirmAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class updateUserStatusDto {
  @IsNotEmpty()
  @IsIn(accountStatusTypes)
  @IsString()
  status: string;
}

export class updateProfileDto {
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