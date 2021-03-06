import { IsNotEmpty, IsOptional, IsUrl, IsString, IsInt, IsEmail, IsIn, Min, IsMobilePhone, IsArray, } from "class-validator";
import { AccountDto as AccountDto } from "@users/dtos/users.dto";

export class SalonDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  // @Max(4)
  salontypeid: number;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  alias: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  logouri: string;

  @IsOptional()
  @IsEmail()
  officialemail: string;
}

export class SalonupdateDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  // @Max(4)
  salontypeid: number;

  @IsString()
  @IsOptional()
  name: string;
  
  @IsOptional()
  @IsString()
  alias: string;
  
  @IsOptional()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsUrl()
  logouri: string;

  @IsOptional()
  @IsEmail()
  officialemail: string;
}

export class CreateSpecialistDto extends AccountDto{
  @IsInt()
  @IsNotEmpty()
  @IsIn([2], {
    message: "Invalid account type! Must be type of 'specialist'"
  })
  accounttypeid: number; 
}

export class SalonIdDto {
  @IsNotEmpty()
  @IsInt()
  id: number
}

export class AddServicesDto {
  @IsArray()
  @IsNotEmpty()
  serviceids: number[];
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