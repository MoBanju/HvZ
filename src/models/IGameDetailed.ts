import { IChat } from "./IChat";
import { IGame } from "./IGame";
import { IPlayer } from "./IPlayer";

export interface IGameDetailed extends IGame{
    players: IPlayer[],
    chat: IChat[],
}