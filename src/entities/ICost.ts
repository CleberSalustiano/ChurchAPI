import { IChurch } from "./IChurch"

export interface ICost {
  id: number
  value: number
  date: Date
  description: string
  deletedAt?: Date | null
  id_church: number
  church?: IChurch;
}
