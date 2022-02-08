import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import GlobalQueryDto from "@dtos/GlobalQueryDto";
import { 
  transformToPrismaInQueryForNumber, 
  transformToPrismaContainsQueryForString, 
  transformToPrismaOrderByQuery 
} from "@utils/prisma.query.transformer.utils";
import { transformToGoogleCoordinatesStrings } from "@utils/transform-to-google-coordinates";
import { validOrderByFieldsForLocations } from "@constants/locations.constants";

export class LocationsQueryDto extends GlobalQueryDto {
  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "id"))
  @IsOptional()
  id: Record<string, number[]>;

  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "salonid"))
  @IsOptional()
  salonid: Record<string, number[]>;

  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "cityid"))
  @IsOptional()
  cityid: Record<string, number[]>;

  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "stateid"))
  @IsOptional()
  stateid: Record<string, number[]>;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "address"))
  @IsOptional()
  address: string;

  @Transform(({ value }) => transformToGoogleCoordinatesStrings(value, "googlelocation"))
  @IsOptional()
  googlelocation: Record<string, number[]>;

  @Transform(({ value }) => transformToPrismaOrderByQuery(value, validOrderByFieldsForLocations))
  @IsOptional()
  orderby: Record<string, number>;
}
