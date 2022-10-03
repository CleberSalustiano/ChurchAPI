import { IChurch } from "./IChurch"

export interface ICost {
  id: number
  value: number
  date: Date
  description: string
  id_church: number
  church?: IChurch;
}