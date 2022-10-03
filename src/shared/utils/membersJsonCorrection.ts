import { IMember } from "../../entities/IMember";

const membersJsonCorrection = (members: IMember[] | undefined) => {
  if (members) {
    const membersJSON = members.map((member) => {
      // @ts-ignore
      member.cpf = +member.cpf.toString();
      return member;
    });
    return membersJSON;
  }
}

export default membersJsonCorrection;