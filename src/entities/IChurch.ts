import { IManager } from "./IManager"

export interface IChurch {
  id: number
  creationDate: Date
  id_location: number
  manager?: IManager[]
}