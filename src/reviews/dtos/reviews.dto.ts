import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class RequestCreateReviewDto {
  @IsNotEmpty()
  @IsInt()
  salonid: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  ratings: number;
}