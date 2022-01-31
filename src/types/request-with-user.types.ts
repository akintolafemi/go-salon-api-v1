import { users as UserModel } from "@prisma/client";

type Login = {
  username: string;
  password: string;
  status: string;
  lastlogin: string;
}

type User = {
  user: UserModel;
};

type OtherData = {
  otherData: any;
}

type RequestWithUser = Request & User & Login & OtherData;

export default RequestWithUser;
