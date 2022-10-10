import { IPlayer } from "./IPlayer";

export interface IChat {
    id: number
    message: string,
    isHumanGlobal: boolean,
    isZombieGlobal: boolean,
    chatTime: string,
    player: IPlayer,
}