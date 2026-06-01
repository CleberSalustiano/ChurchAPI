import prismaClient from "../src/shared/infra/database/prismaClient";
import { hashPassword } from "../src/shared/security/password";

type ChurchSeedInput = {
  cep: number;
  street: string;
  district: string;
  city: string;
  state: string;
  country: string;
  creationDate: string;
  type: "HEADQUARTER" | "BRANCH";
  parentChurchId?: number | null;
};

type MemberSeedInput = {
  login: string;
  password: string;
  temporaryPassword?: boolean;
  name: string;
  birthDate: string;
  batismDate: string;
  ecclesiasticalRole: string;
  cpf: string;
  rg: number;
  email: string;
  churchId: number;
};

async function ensureLocation(input: Omit<ChurchSeedInput, "creationDate" | "type" | "parentChurchId">) {
  return prismaClient.location.upsert({
    where: { cep: input.cep },
    update: {
      street: input.street,
      district: input.district,
      city: input.city,
      state: input.state,
      country: input.country,
    },
    create: input,
  });
}

async function ensureChurch(input: ChurchSeedInput) {
  const location = await ensureLocation({
    cep: input.cep,
    street: input.street,
    district: input.district,
    city: input.city,
    state: input.state,
    country: input.country,
  });

  const existingChurch = await prismaClient.church.findFirst({
    where: {
      id_location: location.id,
    },
  });

  if (existingChurch) {
    return prismaClient.church.update({
      where: { id: existingChurch.id },
      data: {
        creationDate: new Date(input.creationDate),
        type: input.type,
        parentChurchId: input.parentChurchId ?? null,
        status: "ACTIVE",
        deactivatedAt: null,
        deletedAt: null,
      },
      include: { location: true },
    });
  }

  return prismaClient.church.create({
    data: {
      creationDate: new Date(input.creationDate),
      type: input.type,
      parentChurchId: input.parentChurchId ?? null,
      id_location: location.id,
      status: "ACTIVE",
    },
    include: { location: true },
  });
}

async function ensureMember(input: MemberSeedInput) {
  const hashedPassword = await hashPassword(input.password, {
    skipPolicy: input.temporaryPassword,
  });

  const user = await prismaClient.user.upsert({
    where: { login: input.login },
    update: {
      password: hashedPassword,
      deletedAt: null,
    },
    create: {
      login: input.login,
      password: hashedPassword,
    },
  });

  const member = await prismaClient.member.upsert({
    where: { cpf: BigInt(input.cpf) },
    update: {
      name: input.name,
      birth_date: new Date(input.birthDate),
      batism_date: new Date(input.batismDate),
      ecclesiasticalRole: input.ecclesiasticalRole,
      rg: input.rg,
      email: input.email,
      id_church: input.churchId,
      id_user: user.id,
      deletedAt: null,
    },
    create: {
      name: input.name,
      birth_date: new Date(input.birthDate),
      batism_date: new Date(input.batismDate),
      ecclesiasticalRole: input.ecclesiasticalRole,
      cpf: BigInt(input.cpf),
      rg: input.rg,
      email: input.email,
      id_church: input.churchId,
      id_user: user.id,
    },
  });

  return { user, member };
}

async function ensureManager(idMember: number, idChurch: number) {
  const existingManager = await prismaClient.manager.findFirst({
    where: {
      id_member: idMember,
      id_church: idChurch,
      endDate: null,
    },
  });

  if (existingManager) {
    return existingManager;
  }

  return prismaClient.manager.create({
    data: {
      id_member: idMember,
      id_church: idChurch,
    },
  });
}

async function ensureTreasurer(idMember: number) {
  const existingTreasurer = await prismaClient.treasurer.findFirst({
    where: {
      id_member: idMember,
      endDate: null,
    },
  });

  if (existingTreasurer) {
    return existingTreasurer;
  }

  return prismaClient.treasurer.create({
    data: {
      id_member: idMember,
    },
  });
}

async function ensureOffer(idTreasurer: number, value: number) {
  const existingOffer = await prismaClient.offer.findFirst({
    where: {
      id_treasurer: idTreasurer,
      value,
      deletedAt: null,
    },
  });

  if (existingOffer) {
    return existingOffer;
  }

  return prismaClient.offer.create({
    data: {
      id_treasurer: idTreasurer,
      value,
    },
  });
}

async function ensureSpecialOffer(
  reason: string,
  date: string,
  idOffer: number,
  idMember: number,
  idChurch: number
) {
  const existingSpecialOffer = await prismaClient.specialOffer.findFirst({
    where: {
      reason,
      date: new Date(date),
      id_offer: idOffer,
      id_member: idMember,
      id_church: idChurch,
      deletedAt: null,
    },
  });

  if (existingSpecialOffer) {
    return existingSpecialOffer;
  }

  return prismaClient.specialOffer.create({
    data: {
      reason,
      date: new Date(date),
      id_offer: idOffer,
      id_member: idMember,
      id_church: idChurch,
    },
  });
}

async function ensureTithe(month: number, year: number, idSpecialOffer: number) {
  const existingTithe = await prismaClient.tithe.findFirst({
    where: {
      month,
      year,
      id_special_offer: idSpecialOffer,
      deletedAt: null,
    },
  });

  if (existingTithe) {
    return existingTithe;
  }

  return prismaClient.tithe.create({
    data: {
      month,
      year,
      id_special_offer: idSpecialOffer,
    },
  });
}

async function ensureCost(
  idChurch: number,
  description: string,
  value: number,
  date: string
) {
  const existingCost = await prismaClient.cost.findFirst({
    where: {
      id_church: idChurch,
      description,
      value,
      date: new Date(date),
      deletedAt: null,
    },
  });

  if (existingCost) {
    return existingCost;
  }

  return prismaClient.cost.create({
    data: {
      id_church: idChurch,
      description,
      value,
      date: new Date(date),
    },
  });
}

async function ensureCult(
  idChurch: number,
  theme: string,
  date: string,
  idOffer?: number
) {
  const existingCult = await prismaClient.cult.findFirst({
    where: {
      id_church: idChurch,
      theme,
      date: new Date(date),
      deletedAt: null,
    },
  });

  if (existingCult) {
    return existingCult;
  }

  return prismaClient.cult.create({
    data: {
      id_church: idChurch,
      theme,
      date: new Date(date),
      id_offer: idOffer,
    },
  });
}

async function main() {
  const headquarter = await ensureChurch({
    cep: 1001000,
    street: "Rua Central",
    district: "Centro",
    city: "Sao Paulo",
    state: "SP",
    country: "Brasil",
    creationDate: "2024-01-15",
    type: "HEADQUARTER",
  });

  const campinas = await ensureChurch({
    cep: 13010000,
    street: "Rua da Filial",
    district: "Bairro Novo",
    city: "Campinas",
    state: "SP",
    country: "Brasil",
    creationDate: "2024-02-10",
    type: "BRANCH",
    parentChurchId: headquarter.id,
  });

  const santos = await ensureChurch({
    cep: 11010000,
    street: "Avenida do Porto",
    district: "Valongo",
    city: "Santos",
    state: "SP",
    country: "Brasil",
    creationDate: "2024-03-08",
    type: "BRANCH",
    parentChurchId: headquarter.id,
  });

  const headquarterLeader = await ensureMember({
    login: "lider.sede",
    password: "Sede123",
    name: "Lider da Sede",
    birthDate: "1990-01-10",
    batismDate: "2005-02-20",
    ecclesiasticalRole: "Dirigente",
    cpf: "12345678901",
    rg: 123456789,
    email: "lider.sede@churchapp.local",
    churchId: headquarter.id,
  });

  const headquarterAssistant = await ensureMember({
    login: "secretaria.sede",
    password: "Secretaria123",
    name: "Secretaria da Sede",
    birthDate: "1991-06-14",
    batismDate: "2007-05-09",
    ecclesiasticalRole: "Auxiliar",
    cpf: "12345678902",
    rg: 223456789,
    email: "secretaria.sede@churchapp.local",
    churchId: headquarter.id,
  });

  const campinasLeader = await ensureMember({
    login: "dirigente.campinas",
    password: "Campinas123",
    name: "Dirigente de Campinas",
    birthDate: "1992-03-05",
    batismDate: "2008-08-15",
    ecclesiasticalRole: "Dirigente",
    cpf: "12345678903",
    rg: 323456789,
    email: "dirigente.campinas@churchapp.local",
    churchId: campinas.id,
  });

  const campinasTreasurerMember = await ensureMember({
    login: "tesouraria.campinas",
    password: "Tesouraria123",
    name: "Tesoureira de Campinas",
    birthDate: "1989-09-22",
    batismDate: "2006-04-19",
    ecclesiasticalRole: "Cooperadora",
    cpf: "12345678904",
    rg: 423456789,
    email: "tesouraria.campinas@churchapp.local",
    churchId: campinas.id,
  });

  const campinasMember = await ensureMember({
    login: "membro.campinas",
    password: "CampinasMembro123",
    name: "Membro de Campinas",
    birthDate: "1998-11-03",
    batismDate: "2020-01-18",
    ecclesiasticalRole: "Membro",
    cpf: "12345678905",
    rg: 523456789,
    email: "membro.campinas@churchapp.local",
    churchId: campinas.id,
  });

  const santosLeader = await ensureMember({
    login: "dirigente.santos",
    password: "Santos123",
    name: "Dirigente de Santos",
    birthDate: "1988-12-12",
    batismDate: "2004-07-11",
    ecclesiasticalRole: "Dirigente",
    cpf: "12345678906",
    rg: 623456789,
    email: "dirigente.santos@churchapp.local",
    churchId: santos.id,
  });

  const temporaryMember = await ensureMember({
    login: "membro.temp",
    password: "12345678907",
    temporaryPassword: true,
    name: "Membro com Senha Temporaria",
    birthDate: "2000-05-17",
    batismDate: "2021-03-13",
    ecclesiasticalRole: "Membro",
    cpf: "12345678907",
    rg: 723456789,
    email: "membro.temp@churchapp.local",
    churchId: santos.id,
  });

  await ensureManager(headquarterLeader.member.id, headquarter.id);
  await ensureManager(campinasLeader.member.id, campinas.id);
  await ensureManager(santosLeader.member.id, santos.id);

  const campinasTreasurer = await ensureTreasurer(campinasTreasurerMember.member.id);
  const headquarterTreasurer = await ensureTreasurer(headquarterAssistant.member.id);

  const headquarterOffer = await ensureOffer(headquarterTreasurer.id, 2500);
  const campinasOffer = await ensureOffer(campinasTreasurer.id, 1200);

  const headquarterSpecialOffer = await ensureSpecialOffer(
    "Oferta missionaria da sede",
    "2024-05-12",
    headquarterOffer.id,
    headquarterAssistant.member.id,
    headquarter.id
  );

  const campinasSpecialOffer = await ensureSpecialOffer(
    "Dizimos e ofertas de Campinas",
    "2024-05-19",
    campinasOffer.id,
    campinasTreasurerMember.member.id,
    campinas.id
  );

  await ensureTithe(5, 2024, headquarterSpecialOffer.id);
  await ensureTithe(5, 2024, campinasSpecialOffer.id);

  await ensureCost(headquarter.id, "Manutencao da sede", 890.5, "2024-05-06");
  await ensureCost(campinas.id, "Som e microfones", 420.75, "2024-05-18");
  await ensureCost(santos.id, "Apoio social local", 310, "2024-05-22");

  await ensureCult(headquarter.id, "Culto de celebracao", "2024-05-12", headquarterOffer.id);
  await ensureCult(campinas.id, "Culto da familia", "2024-05-19", campinasOffer.id);
  await ensureCult(santos.id, "Culto de jovens", "2024-05-26");

  console.log("\nDemo seed pronta.\n");
  console.table([
    {
      perfil: "Sede / Gestao global",
      login: "lider.sede",
      senha: "Sede123",
      observacao: "Editor global",
    },
    {
      perfil: "Filial Campinas / Dirigente",
      login: "dirigente.campinas",
      senha: "Campinas123",
      observacao: "Viewer da filial",
    },
    {
      perfil: "Filial Campinas / Tesouraria",
      login: "tesouraria.campinas",
      senha: "Tesouraria123",
      observacao: "Editor local",
    },
    {
      perfil: "Filial Campinas / Membro",
      login: "membro.campinas",
      senha: "CampinasMembro123",
      observacao: "Membro comum",
    },
    {
      perfil: "Fluxo de troca obrigatoria",
      login: "membro.temp",
      senha: "12345678907",
      observacao: "Vai exigir nova senha no primeiro acesso",
    },
  ]);
}

main()
  .catch((error) => {
    console.error("Erro ao preparar a demo:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
