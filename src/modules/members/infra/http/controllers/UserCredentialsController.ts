import { Request, Response } from "express";
import {
  makeUpdateUserLoginService,
  makeUpdateUserPasswordService,
} from "../../../../../shared/container";
import userPublicData from "../../../../../shared/utils/userPublicData";

interface IRequestUpdateLogin {
  login: string;
}

interface IRequestUpdatePassword {
  password: string;
}

export default class UserCredentialsController {
  async updateLogin(request: Request, response: Response) {
    const { login }: IRequestUpdateLogin = request.body;
    const { id } = request.params;

    const updateUserLogin = makeUpdateUserLoginService();
    const user = await updateUserLogin.execute(+id, login);

    return response.json({ user: user ? userPublicData(user) : undefined });
  }

  async updatePassword(request: Request, response: Response) {
    const { password }: IRequestUpdatePassword = request.body;
    const { id } = request.params;

    const updateUserPassword = makeUpdateUserPasswordService();
    const user = await updateUserPassword.execute(+id, password);

    return response.json({ user: user ? userPublicData(user) : undefined });
  }
}
