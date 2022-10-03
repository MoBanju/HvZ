import { IChat } from "./IChat";
import { IGameState } from "./IGameState";
import { IPlayer } from "./IPlayer";

export interface IGame {
    title: string,
    description: string,
    state: keyof IGameState,
    players: IPlayer[],
    chat: IChat[],
}


