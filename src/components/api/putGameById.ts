import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IGame } from "../../models/IGame";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { updateGameState } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    game: IGame
}

export async function PutGameById({game}: IParams): Promise<IGame> {

    const headers = await getAuthHeaders();
    let body = {
        "id": game.id,
        "name": game.name,
        "description": game.description,
        "state": 1
    }
    const response: any = await fetch(API_URL + "/game/" + game.id, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error("Couldnt update gameSTATE")
    }
    return game
}


export const PutGameByIdAction: (game: IGame) => PayloadAction<RequestPayload<IParams, IGame>> = (game: IGame) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: updateGameState,
        params: { game },
        request: PutGameById,
        requestName: RequestsEnum.PutGameById,
    },
})
