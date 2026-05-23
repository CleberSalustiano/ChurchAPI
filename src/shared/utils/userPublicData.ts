import { IUser } from "../../entities/IUser";

export default function userPublicData(user: IUser) {
  return {
    id: user.id,
    login: user.login,
  };
}
