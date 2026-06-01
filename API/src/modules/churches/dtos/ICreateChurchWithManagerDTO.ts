import { ChurchType } from "../../../entities/IChurch";

export interface ICreateChurchWithManagerDTO {
  church: {
    date: string;
    street: string;
    district: string;
    city: string;
    state: string;
    country: string;
    cep: number;
    type?: ChurchType;
  };
  manager: {
    name: string;
    birth_date: string;
    batism_date: string;
    ecclesiasticalRole: string;
    cpf: bigint;
    rg: number;
    email: string;
    login: string;
    password?: string;
  };
}
