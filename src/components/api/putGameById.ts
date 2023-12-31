import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IGame } from "../../models/IGame";
import { IGameState } from "../../models/IGameState";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE, sideEffect } from "../../store/middleware/requestMiddleware";
import { updateGameState } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    game: IGame
    state: keyof IGameState
}

export async function PutGameById({game, state}: IParams): Promise<IGame> {

    let myPar = 0
    if(state === "Registration") myPar = 0
    else if(state === "Progress") myPar = 1
    else if(state === "Complete") myPar = 2

    const headers = await getAuthHeaders();
    const body = {
        "id": game.id,
        "name": game.name,
        "description": game.description,
        "state": myPar,
        ne_lat: game.ne_lat,
        ne_lng: game.ne_lng,
        sw_lat: game.sw_lat,
        sw_lng: game.sw_lng,
        startTime: game.startTime,
        endTime: game.endTime,
    }
    const response: any = await fetch(API_URL + "/game/" + game.id, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    const newGame: IGame = {
        id: game.id,
        name: game.name,
        description: game.description,
        playerCount: game.playerCount,
        state: "Progress",
        ne_lat: game.ne_lat,
        ne_lng: game.ne_lng,
        sw_lat: game.sw_lat,
        sw_lng: game.sw_lng,
        startTime: game.startTime,
        endTime: game.endTime,
    }
    if(myPar === 0) newGame.state = "Registration"
    else if(myPar === 1)newGame.state = "Progress"
    else if(myPar === 2)newGame.state = "Complete"

    return newGame
}


export function PutGameByIdAction(game: IGame, state: keyof IGameState, sideEffect: sideEffect): PayloadAction<RequestPayload<IParams, IGame>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: updateGameState,
            params: { game, state },
            request: PutGameById,
            requestName: RequestsEnum.PutGameById,
            sideEffect,
        },
    }
};