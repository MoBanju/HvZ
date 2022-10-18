import { IPlayer } from "./IPlayer";

export interface IKill {
    id : number,
    timeDeath: string,
    latitude: number,
    longitude: number,
    description: string,
    killer: IPlayer,
    victirm: IPlayer,
}