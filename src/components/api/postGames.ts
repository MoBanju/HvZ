import { PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../models/IChat";
import { IGame } from "../../models/IGame";
import { IGameState } from "../../models/IGameState";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addChatMsg } from "../../store/slices/gameSlice";
import { addGame } from "../../store/slices/gamesSlice";
import { IChatResponse } from "./getChatByGameId";
import { IGameResponse } from "./getGames";

export interface PostGameRequest {
    name: string,
    // description: string,
}

interface IParams {
    gameInfo: PostGameRequest,
}

async function postGames({gameInfo}: IParams): Promise<IGame>{
    let body: PostGameRequest = {
        name: gameInfo.name,
        // description: gameInfo.description,
    };

    let response = await fetch(`http://localhost:5072/game`, {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if(!response.ok)
        throw new Error(response.statusText);
    let createdGame = await response.json() as IGameResponse;
    return {
        id: createdGame.id,
        name: createdGame.name,
        description: "",
        state: "register",
    }
};


export const PostGameAction: (gameInfo: PostGameRequest) => PayloadAction<RequestPayload<IParams, IGame>> = (gameInfo: PostGameRequest) => ({
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addGame,
            params: {gameInfo},
            request: postGames,
            requestName: RequestsEnum.PostGame,
        },
    });