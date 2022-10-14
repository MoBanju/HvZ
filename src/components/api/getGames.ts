import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IGame } from "../../models/IGame";
import { IGameState } from "../../models/IGameState";
import { REQUEST_ACTION_TYPE, RequestPayload, RequestsEnum } from "../../store/middleware/requestMiddleware";
import { setGames } from "../../store/slices/gamesSlice";
import getAuthHeaders from "./setAuthHeaders";

export interface IGameResponse {
    id: number
    name: string,
    description: string,
    state: keyof IGameState,
}

interface IParams { };

async function getGames({}: IParams) {
    const headers = await getAuthHeaders();
    let response = await fetch(API_URL + '/game', {
        headers,
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as IGameResponse[];
    return data;
}

export const GetGamesAction: () => PayloadAction<RequestPayload<IParams, IGame[]>> = () => ({
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: setGames,
            params: {},
            request: getGames,
            requestName: RequestsEnum.GetGames,
        },
    });
