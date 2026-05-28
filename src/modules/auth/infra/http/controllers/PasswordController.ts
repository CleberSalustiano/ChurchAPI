import { Request, Response } from "express";
import {
  makeRequestPasswordResetService,
  makeResetPasswordService,
} from "../../../../../shared/container";

interface IRequestForgotPassword {
  email: string;
}

interface IRequestResetPassword {
  token: string;
  password: string;
}

export default class PasswordController {
  async forgot(request: Request, response: Response) {
    const { email }: IRequestForgotPassword = request.body;

    const requestPasswordReset = makeRequestPasswordResetService();
    const result = await requestPasswordReset.execute(email);

    return response.json(result);
  }

  async reset(request: Request, response: Response) {
    const { token, password }: IRequestResetPassword = request.body;

    const resetPassword = makeResetPasswordService();
    await resetPassword.execute(token, password);

    return response.json({
      message: "Password has been reset successfully",
    });
  }
}
