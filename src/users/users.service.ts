import { HttpException, HttpStatus, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import RequestWithUser from "src/types/request-with-user.types";
import { PrismaService } from "src/prisma.service";
import { ResponseManager, standardResponse } from "@utils/response-manager.utils";
import { createAccountDto, confirmAccountDto, updateUserStatusDto, updateProfileDto } from "./dtos/users.dto";
import * as bcrypt from 'bcrypt';
import { hashRounds } from "@constants/hash.constants";
import SendMail from "@utils/sendmail";
import { encryptStr } from "@utils/encrypt-decrypt-crypto";
import { randomChar } from "@utils/random-utils";

@Injectable({ scope: Scope.REQUEST })
export class UsersService {

  constructor(
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly prismaService: PrismaService
  ) {}

  public async createAccount(createAccountRequest: createAccountDto): Promise<standardResponse> {

    try {

      const email = createAccountRequest.username;

      const hashPassword = await bcrypt.hash(createAccountRequest.password, hashRounds);

      const tokenChar = randomChar();

      const createLogin = await this.prismaService.logins.create({
        data: {
          username: createAccountRequest.username,
          password: hashPassword,
          token: tokenChar,
          status: 'pending verification'
        }
      });
      if (createLogin) {
        
        delete createAccountRequest["username"];
        delete createAccountRequest["password"];
        const createUser = await this.prismaService.users.create({
          data: { 
            userid: createLogin.id,
            email: email,
            ...createAccountRequest 
          }
        });

        const msg = {
          to: email, // Change to your recipient
          templateId: `${process.env.CONFIRM_ACCOUNT_MAIL_ID}`,
          dynamicTemplateData: {
            first_name: createAccountRequest.firstname,
            Weblink: `${process.env.CONFIRM_ACCOUNT_URL}/${email}/${tokenChar}`,
          }
        };
  
        const onSendEmail = await SendMail(msg, 'Registeration confirmation');

        let resMes = ``;
        if (onSendEmail)
          resMes = `account created, please check your email for confirmation link`;
        else
          resMes = `account created, email verification link pending`;

        return ResponseManager.standardResponse("success", HttpStatus.CREATED, resMes, { ...createUser, username: email, status: createLogin.status});
      }
      else {
        return ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to create account`, null);
      }

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `account creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getUserByUserId(userid: number): Promise<standardResponse> {
    try {
      const user = await this.prismaService.logins.findUnique({
        where: {id: userid},
        select: {
          username: true,
          lastlogin: true,
          status: true,
          islogin: true,
          users: {
            select: {
              userid: true,
              salonid: true,
              accounttypeid: true,
              firstname: true,
              lastname: true,
              othernames: true,
              email: true,
              mobile: true,
              homeaddress: true,
              avatar: true,
              datecreated: true,
              dateupdated: true,
              datedeactivated: true,
              deactivated: true,
              _count: true,
              accounttypes: true,
            }
          }
        }
      });

      if (!user) {
        return ResponseManager.standardResponse("success", HttpStatus.NOT_FOUND, `account with user id ${userid} does not exist`, null);
      }
      return ResponseManager.standardResponse("success", HttpStatus.OK, `account with user id ${userid} found`, { ...user.users, username: user.username, lastlogin: user.lastlogin, status: user.status, islogin: user.islogin});
    } catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to get account with user id ${userid}`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async confirmAccount({email, token}: confirmAccountDto): Promise<standardResponse> {
    try {
      const login = await this.prismaService.logins.findFirst({
        where: {
          AND: [{ 
            username: email
          }, {
            token: token 
          }]
        },
        select: {
          id: true,
        }
      });

      if (!login) {
        return ResponseManager.standardResponse("success", HttpStatus.NOT_FOUND, `invalid confirmation link.`, null);
      }
      else {
        await this.prismaService.logins.update({
          where: {
            id: login.id
          },
          data: {
            token: null,
            status: 'active',
          }
        });

        return ResponseManager.standardResponse("success", HttpStatus.OK, `account verification successful`, null);
      }

    } catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to verify account`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateAccountStatus(userid: number, updateRequest: updateUserStatusDto): Promise<standardResponse> {
    try {
      
      await this.prismaService.logins.update({
        where: { id: userid },
        data: {
          ...updateRequest 
        }
      });

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `account status set to '${updateRequest.status}' successfully`, null);
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating status, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deactivateAccount(userid: number): Promise<standardResponse> {
    try {
      
      await this.prismaService.logins.update({
        where: { id: userid },
        data: {
          status: "deactivated" 
        }
      });

      await this.prismaService.users.update({
        where: { userid: userid },
        data: {
          deactivated: 1,
          datedeactivated: new Date()
        }
      })

      return ResponseManager.standardResponse("success", HttpStatus.OK, `account deactivated successfully`, null);
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured deactivating account, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateProfile(userid: number, updateRequest: updateProfileDto): Promise<standardResponse> {

    //check if body has data
    if (Object.keys(updateRequest).length === 0) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.BAD_REQUEST, `no data to update`, null),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const update = await this.prismaService.users.update({
        where: { userid: userid },
        data: updateRequest
      });
      return ResponseManager.standardResponse("success", HttpStatus.OK, "Profile updated successfully", null, null);

    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured updating profile, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
