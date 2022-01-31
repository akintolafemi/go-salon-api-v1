import { IsNotEmpty, IsOptional, IsUrl, IsString, IsInt, IsEmail, IsIn, Min, IsMobilePhone, IsArray, } from "class-validator";
import { accountDto } from "@users/dtos/users.dto";
import { specialistStatusTypes } from "@constants/specialists.constants";

export class createSpecialistDto extends accountDto{
  @IsInt()
  @IsNotEmpty()
  @IsIn([2], {
    message: "Invalid account type! Must be type of 'specialist'"
  })
  accounttypeid: number; 
}


export class updateSpecialistDto {
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

export class updateSpecialistStatusDto {
  @IsNotEmpty()
  @IsIn(specialistStatusTypes)
  @IsString()
  status: string;
}