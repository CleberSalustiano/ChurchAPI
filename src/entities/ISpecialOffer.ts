import { IMember } from "./IMember";
import { IOffer } from "./IOffer";

export interface ISpecialOffer extends IOffer{
    reason: String;
    date: Date;
    member: IMember;
} 