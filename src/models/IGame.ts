import { IGameState } from "./IGameState";

export interface IGame {
    id: number
    name: string,
    description: string,
    state: keyof IGameState,
    playerCount: number,
    ne_lat: number,
    ne_lng: number,
    sw_lat: number,
    sw_lng: number,
    startTime: string,
    endTime: string
}


