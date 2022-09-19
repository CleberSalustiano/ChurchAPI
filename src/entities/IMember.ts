import { ISpecialOffer } from "./ISpecialOffer";

export interface IMember {
    name: String;
    bith_date: Date;
    batism_date: Date;
    titleChurch: String;
    cpf: BigInt;
    rg: Number;
    login: String;
    email: String;
    password: String;
    foto?: String;
    specialsOffers?: ISpecialOffer[];
}