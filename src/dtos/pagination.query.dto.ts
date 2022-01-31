import { IsOptional } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ResponseManager } from "@utils/response-manager.utils";
import { Transform } from "class-transformer";

const isNumeric = (value: number) => !isNaN(value);

const convertBeNumber = (value: string, fieldName: string) => {
  //ensure value is not empty
  if (!value || value.length === 0) {
    throw new HttpException(
      ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is empty`, null),
      HttpStatus.BAD_REQUEST,
    );
  }

  if (isNumeric(Number(value))) {
    return Number(value);
  }

  throw new HttpException(
    ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `query parameter ${fieldName} is invalid`, null),
    HttpStatus.BAD_REQUEST,
  );
};

export default class PaginationQueryDto {
  @Transform(({ value }) => convertBeNumber(value, "page"))
  @IsOptional()
  page: number;

  @Transform(({ value }) => convertBeNumber(value, "limit"))
  @IsOptional()
  limit: number;
}
