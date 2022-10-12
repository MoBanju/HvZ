import { IUser } from "./IUser";

export interface IPlayer {
    id: number,
    isHuman: boolean,
    isPatientZero: boolean,
    biteCode: string,
    user: IUser,
}