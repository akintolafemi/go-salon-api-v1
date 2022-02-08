import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import GlobalQueryDto from "@dtos/GlobalQueryDto";
import { 
  transformToPrismaInQueryForNumber, 
  transformToPrismaContainsQueryForString, 
  transformToPrismaOrderByQuery 
} from "@utils/prisma.query.transformer.utils";
import { validOrderByFieldsForSalons } from "@constants/salons.constants";

export class SalonsQueryDto extends GlobalQueryDto {
  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "id"))
  @IsOptional()
  id: Record<string, number[]>;

  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "ownerid"))
  @IsOptional()
  ownerid: Record<string, number[]>;

  @Transform(({ value }) => transformToPrismaInQueryForNumber(value, "salontypeid"))
  @IsOptional()
  salontypeid: Record<string, number[]>;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "name"))
  @IsOptional()
  name: string;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "alias"))
  @IsOptional()
  alias: string;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "officialemail"))
  @IsOptional()
  officialemail: string;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "description"))
  @IsOptional()
  description: string;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "status"))
  @IsOptional()
  status: string;

  @Transform(({ value }) => transformToPrismaOrderByQuery(value, validOrderByFieldsForSalons))
  @IsOptional()
  orderby: Record<string, number>;
}
