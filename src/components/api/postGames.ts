import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IChat } from "../../models/IChat";
import { IGame } from "../../models/IGame";
import { IGameState } from "../../models/IGameState";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addChatMsg } from "../../store/slices/gameSlice";
import { addGame } from "../../store/slices/gamesSlice";
import { IChatResponse } from "./getChatByGameId";
import { IGameResponse } from "./getGames";
import getAuthHeaders from "./setAuthHeaders";

export interface PostGameRequest {
    name: string,
    description: string,
}

interface IParams {
    gameInfo: PostGameRequest,
}

async function postGames({gameInfo}: IParams): Promise<IGame>{
    let body: PostGameRequest = {
        name: gameInfo.name,
        description: gameInfo.description,
    };
    const headers = await getAuthHeaders();

    let response = await fetch(`${API_URL}/game`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if(!response.ok)
        throw new Error(response.statusText);
    let createdGame = await response.json() as IGameResponse;
    return {
        id: createdGame.id,
        name: createdGame.name,
        description: createdGame.description,
        state: "Registration",
    }
};


export const PostGameAction: (gameInfo: PostGameRequest, sideEffect: ()=> void) => PayloadAction<RequestPayload<IParams, IGame>> = (gameInfo: PostGameRequest, sideEffect: ()=> void) => ({
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addGame,
            params: {gameInfo},
            request: postGames,
            requestName: RequestsEnum.PostGame,
            sideEffect,
        },
    });