import { IMember } from "../../entities/IMember";

const membersJsonCorrection = (members: IMember[] | undefined) => {
  if (members) {
    return members.map((member) => ({
      ...member,
      cpf: member.cpf.toString(),
    }));
  }
}

export default membersJsonCorrection;
