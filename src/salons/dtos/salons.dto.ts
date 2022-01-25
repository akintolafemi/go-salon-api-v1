import { IsNotEmpty, IsOptional, IsUrl, IsString, IsInt, IsEmail, IsIn, Min, Max, } from "class-validator";


export class salonDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(4)
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
