import { Request, Response } from "express";
import {
  makeAuthenticateUserService,
  makeGetAuthenticatedProfileService,
  makeResolveSystemAccessService,
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
    const resolveSystemAccess = makeResolveSystemAccessService();
    const access = await resolveSystemAccess.execute(session.user.id);

    return response.json({
      ...session,
      access,
      permissions: access?.permissions,
    });
  }

  async show(request: Request, response: Response) {
    const getAuthenticatedProfile = makeGetAuthenticatedProfileService();
    const profile = await getAuthenticatedProfile.execute(
      (request as Request & { user: { id: number } }).user.id
    );
    const resolveSystemAccess = makeResolveSystemAccessService();
    const access = await resolveSystemAccess.execute(
      (request as Request & { user: { id: number } }).user.id
    );

    return response.json({
      ...profile,
      access,
      permissions: access?.permissions,
    });
  }
}
