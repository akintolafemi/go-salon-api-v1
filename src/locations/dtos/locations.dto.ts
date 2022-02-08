import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, } from "class-validator";
import { Transform } from "class-transformer";
import { transformToGoogleCoordinatesStrings } from "@utils/transform-to-google-coordinates";

export class LocationDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  cityid: number;

  @IsNumber()
  @IsNotEmpty()
  stateid: number;

  @Transform(({ value }) => transformToGoogleCoordinatesStrings(value, "googlelocation"))
  @IsOptional()
  googlelocation: string;
}

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  address: string;

  @IsInt()
  @IsOptional()
  cityid: number;

  @IsInt()
  @IsOptional()
  stateid: number;

  @Transform(({ value }) => transformToGoogleCoordinatesStrings(value, "googlelocation"))
  @IsOptional()
  googlelocation: string;
}