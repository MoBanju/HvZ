import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IGame } from "../../models/IGame";
import { REQUEST_ACTION_TYPE, RequestPayload, RequestsEnum } from "../../store/middleware/requestMiddleware";
import { setGames } from "../../store/slices/gamesSlice";
import getAuthHeaders from "./setAuthHeaders";


interface IParams { };

async function getGames({}: IParams) {
    const headers = await getAuthHeaders();
    let response = await fetch(API_URL + '/game', {
        headers,
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as IGame[];
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
