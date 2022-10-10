import { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";
import { REQUEST_ACTION_TYPE, RequestPayload, RequestsEnum } from "../../store/middleware/requestMiddleware";
import { setGame } from "../../store/slices/gameSlice";
import { IGameResponse } from "./getGames";
import getPlayersByGameId from "./getPlayersByGameId";

interface IParams {
    id: number
};

async function getGameByIdRequest({ id }: IParams) {
    let game = await GetGameById(id);
    let players = await getPlayersByGameId(id);
    return {
        game,
        players,
    }
}

async function GetGameById(id: number) {
    let response = await fetch('http://localhost:5072/game/' + id);
    if(!response.ok)
        throw new Error(response.statusText);
    let gameResponse = await response.json() as IGameResponse;
    let game: IGame= {
        ...gameResponse,
        state: 'complete',
    }
    return game;
}



export function GetGameByIdAction(id: number): PayloadAction<RequestPayload<IParams, {game: IGame, players: IPlayer[]}>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: setGame,
            params: {id},
            request: getGameByIdRequest,
            requestName: RequestsEnum.GetGameById,
        },
    }
};
