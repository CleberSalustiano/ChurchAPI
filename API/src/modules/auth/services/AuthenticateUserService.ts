import { sign, SignOptions } from "jsonwebtoken";
import AppError from "../../../shared/errors/AppError";
import authConfig from "../../../shared/config/auth";
import {
  hasTemporaryMemberPassword,
  verifyMemberPassword,
} from "../../../shared/security/password";
import { IMemberRepository } from "../../members/repositories/IMemberRepository";
import { IUserRepository } from "../../members/repositories/IUserRepository";

interface IResponse {
  token: string;
  mustChangePassword: boolean;
  user: {
    id: number;
    login: string;
  };
  member: {
    id: number;
    name: string;
    email: string;
    ecclesiasticalRole: string;
    id_church: number;
  };
}

export default class AuthenticateUserService {
  constructor(
    private userRepository: IUserRepository,
    private memberRepository: IMemberRepository
  ) {
    this.userRepository = userRepository;
    this.memberRepository = memberRepository;
  }

  async execute(login: string, password: string): Promise<IResponse> {
    const user = await this.userRepository.findByLogin(login);

    if (!user) {
      throw new AppError("Invalid login or password", 401);
    }

    const member = await this.memberRepository.findByUserId(user.id);

    if (!member) {
      throw new AppError("Member profile not found for this user", 404);
    }

    const passwordMatched = await verifyMemberPassword(
      password,
      user.password,
      member.cpf
    );

    if (!passwordMatched) {
      throw new AppError("Invalid login or password", 401);
    }

    if (!member.church || member.church.status !== "ACTIVE") {
      throw new AppError("This church is not active", 403);
    }

    const mustChangePassword = await hasTemporaryMemberPassword(
      user.password,
      member.cpf
    );

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id.toString(),
      expiresIn: authConfig.jwt.expiresIn as SignOptions["expiresIn"],
    } as SignOptions);

    return {
      token,
      mustChangePassword,
      user: {
        id: user.id,
        login: user.login,
      },
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        ecclesiasticalRole: member.ecclesiasticalRole,
        id_church: member.id_church,
      },
    };
  }
}
