import { IMember } from "../../entities/IMember";

export default function memberPublicData(member: IMember) {
  return {
    id: member.id,
    name: member.name,
    birth_date: member.birth_date,
    batism_date: member.batism_date,
    ecclesiasticalRole: member.ecclesiasticalRole,
    cpf: member.cpf.toString(),
    rg: member.rg,
    email: member.email,
    foto: member.foto,
    id_church: member.id_church,
    church: member.church,
  };
}
