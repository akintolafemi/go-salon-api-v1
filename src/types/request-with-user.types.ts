import { users as UserModel } from "@prisma/client";

type Login = {
  username: string;
  lastlogin: Date;
  status: string;
}

type User = {
  user: UserModel;
};

type RequestWithUser = Request & User & Login;

export default RequestWithUser;
