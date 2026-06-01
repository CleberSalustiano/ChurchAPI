import { Request, Response } from "express";
import {
  makeAuthenticateUserService,
  makeGetAuthenticatedProfileService,
} from "../../../../../shared/container";

interface IRequestCreateSession {
  login: string;
  password: string;
}

export default class SessionController {
  async create(request: Request, response: Response) {
    const { login, password }: IRequestCreateSession = request.body;

    const authenticateUser = makeAuthenticateUserService();
    const session = await authenticateUser.execute(login, password);

    return response.json(session);
  }

  async show(request: Request, response: Response) {
    const getAuthenticatedProfile = makeGetAuthenticatedProfileService();
    const profile = await getAuthenticatedProfile.execute(
      (request as Request & { user: { id: number } }).user.id
    );

    return response.json(profile);
  }
}
