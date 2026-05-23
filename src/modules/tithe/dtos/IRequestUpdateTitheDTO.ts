export interface IRequestUpdateTitheDTO {
  id_church: number;
  id_member: number
  reason: string;
  date: String;
  month: number;
  year: number;
  value: number;
  id_treasurer: number;
  id_tithe: number;
}
