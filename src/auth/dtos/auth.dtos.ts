import { IsString, IsNotEmpty, MinLength, IsAlphanumeric } from "class-validator";
import { Match } from "@decorators/match.decorator";

export class PasswordRetrieveDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be a minimum of 8 alphanumeric characters'
  })
  @IsAlphanumeric("en-US", {
    message: 'Password must be alphanumeric'
  })
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {message: 'password too weak, must contact at least one letter and one number'})
  password: string;

  @Match(ResetPasswordDto, (u) => u.password, "password")
  confirmpassword: string;
}

export class UpdatePasswordDto extends ResetPasswordDto {
  @IsString()
  current: string;
}