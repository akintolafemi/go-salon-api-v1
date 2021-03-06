import { IsNotEmpty, IsOptional, IsString, IsInt, IsEmail, IsIn, IsMobilePhone, } from "class-validator";
import { AccountDto as AccountDto } from "@users/dtos/users.dto";
import { specialistStatusTypes } from "@constants/specialists.constants";

export class CreateSpecialistDto extends AccountDto{
  @IsInt()
  @IsNotEmpty()
  @IsIn([2], {
    message: "Invalid account type! Must be type of 'specialist'"
  })
  accounttypeid: number; 
}


export class UpdateSpecialistDto {
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
}

export class UpdateSpecialistStatusDto {
  @IsNotEmpty()
  @IsIn(specialistStatusTypes)
  @IsString()
  status: string;
}