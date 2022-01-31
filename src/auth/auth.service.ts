import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "../types/request-with-user.types";
import { ResponseManager } from "@utils/response-manager.utils";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { updatePasswordDto, passwordRetrieveDto, resetPasswordDto } from "./dtos/auth.dtos";
import { hashRounds } from "@constants/hash.constants";
import * as bcrypt from 'bcrypt';
import { randomChar } from "@utils/random-utils";
import SendMail from "@utils/sendmail";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async signWithJWT() {
    const payload = {
      sub: this.request.user.userid,
      username: this.request.username,
    };
    const token = this.jwtService.sign(payload);
    return ResponseManager.standardResponse("success", HttpStatus.CREATED, "authentication successful", { access_token: token });
  }

  verifyJWT(token: string) {
    let decodedToken = null;
    try {
      decodedToken = this.jwtService.verify(token);
    } catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.UNAUTHORIZED, `invalid JWT token`, null),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return decodedToken;
  }

  async updatePassword (updatePasswordReq: updatePasswordDto) {
    try {
      const passwordsMatch = await bcrypt.compare(updatePasswordReq.current, this.request.user['password']);

      //throw error if passwords do not match
      if (!passwordsMatch) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.UNAUTHORIZED, `Invalid password`, null),
          HttpStatus.UNAUTHORIZED,
        );
      }
      
      const password = updatePasswordReq.password;

      const hashPassword = await bcrypt.hash(password, hashRounds);

      await this.prismaService.logins.update({
        where: { id: this.request.user.userid },
        data: {
          password: hashPassword
        }
      });
      return ResponseManager.standardResponse("success", HttpStatus.OK, "Password updated successfully", null, null);

    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating password, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendPasswordRetrivalLink (updatePasswordReq: passwordRetrieveDto) {
    try {

      const { username } = updatePasswordReq;
      var valid = null;

      //check if username is in logins
      const login = await this.prismaService.logins.findUnique({
        where: { username: username },
        select: {
          users: {
            select: {
              userid: true,
              email: true
            }
          }
        }
      });
      if (login) {
        valid = { id: login.users.userid, email: login.users.email };
      }
      else {
        const user = await this.prismaService.users.findFirst({
          where: { email: username },
          select: {
            userid: true,
            email: true,
          }
        });
        valid = { id: user.userid, email: user.email };
      }

      //check if username is in logins or users tables
      // valid = await this.prismaService.logins.findFirst({
      //   where: {
      //     OR: [
      //       {
      //         username: username,
      //         users: {
      //           email: username
      //         }
      //       }
      //     ]
      //   },
      //   select: {
      //     id: true,
      //     users: {
      //       select: {
      //         email: true,
      //       }
      //     }
      //   }
      // });
      if (valid) {
        const yourKey = randomChar();
        const hashPassword = await bcrypt.hash(yourKey, hashRounds);

        await this.prismaService.logins.update({
          where: { id: valid.id },
          data: {
            password: hashPassword,
            token: yourKey
          }
        });

        const msg = {
          to: valid.email, // Change to your recipient
          templateId: `${process.env.RESET_PASSWORD_MAIL_ID}`,
          dynamicTemplateData: {
            Weblink: `${process.env.RESET_PASSWORD_URL}/${yourKey}`,
          }
        };
  
        const onSendEmail = await SendMail(msg, 'Passsword Reset Link');
        console.log("valid", valid);
        return ResponseManager.standardResponse("success", HttpStatus.OK, "Please check your email account, if you have an account with us, a mail has been sent to you.", null, null);
      }
      else {
        return ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, "Not found", null, null);
      }

    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating password, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword (yourKey: string, resetPasswordReq: resetPasswordDto) {
    try {

      const login = await this.prismaService.logins.findFirst({
        where: { token: yourKey },
        select: {
          id: true,
          username: true,
          password: true,
        }
      });
      console.log("yourKey", yourKey);
      if (login) {
        const comparePassword = await bcrypt.compare(yourKey, login.password);
        const { password } = resetPasswordReq;
        const hashPassword = await bcrypt.hash(password, hashRounds);

        if (comparePassword) {
          await this.prismaService.logins.update({
            where: { id: login.id },
            data: {
              password: hashPassword,
              token: null
            }
          });

          return ResponseManager.standardResponse("success", HttpStatus.OK, "Password reset successful", null, null);

        }
        else 
          return ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, "Password reset fail, invalid token", null, null);
      }
      else 
        return ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, "Password reset fail, invalid url", null, null);

    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating password, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
