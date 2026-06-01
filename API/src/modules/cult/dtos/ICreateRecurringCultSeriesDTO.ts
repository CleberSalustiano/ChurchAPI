export interface ICreateRecurringCultSeriesDTO {
  id_church: number;
  date: string;
  theme: string;
  recurrence: {
    interval: number;
    until: string;
  };
}
