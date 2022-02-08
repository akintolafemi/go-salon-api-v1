import { IsIn, IsOptional, Max, Min } from "class-validator";
import { Transform } from "class-transformer";
import { transformToNumber, transformToValidDate, transformToValidDateRange } from "@utils/global.transform.utils";
import { transformToPrismaContainsQueryForString } from "@utils/prisma.query.transformer.utils";
import PaginationQueryDto from "./PaginationQueryDto";

export default class GlobalQueryDto extends PaginationQueryDto {
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "state"))
  @IsOptional()
  state: string;
  
  @Transform(({ value }) => transformToPrismaContainsQueryForString(value, "city"))
  @IsOptional()
  city: string;

  @Transform(({ value }) => transformToValidDateRange(value, "daterange"))
  @IsOptional()
  daterange: number[];

  @Transform(({ value }) => transformToValidDate(value, "datefrom"))
  @IsOptional()
  datefrom: number;

  @Transform(({ value }) => transformToValidDate(value, "dateto"))
  @IsOptional()
  dateto: number;

  // @Transform(({ value }) => transformToNumberArray(value, "size"))
  // @IsOptional()
  // size: number[];

  @Transform(({ value }) => transformToValidDate(value, "datecreated"))
  @IsOptional()
  datecreated: number;

  @Transform(({ value }) => transformToValidDate(value, "datedeleted"))
  @IsOptional()
  datedeleted: number;

  @Transform(({ value }) => transformToNumber(value, "deleted"))
  @IsOptional()
  @IsIn([0, 1])
  deleted: number;

  @Transform(({ value }) => transformToNumber(value, "ratings"))
  @IsOptional()
  @Min(1)
  @Max(5)
  ratings: number;
}
