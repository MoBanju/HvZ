import { IChat } from "./IChat";
import { IGameState } from "./IGameState";
import { IPlayer } from "./IPlayer";

export interface IGame {
    id: number
    title: string,
    description: string,
    state: keyof IGameState,
}


