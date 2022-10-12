import { IGameState } from "./IGameState";

export interface IGame {
    id: number
    name: string,
    description: string,
    state: keyof IGameState,
}


