import { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IGameState } from "../../models/IGameState";
import { REQUEST_ACTION_TYPE, RequestPayload, RequestsEnum } from "../../store/middleware/requestMiddleware";
import { setGames } from "../../store/slices/gamesSlice";

export interface IGameResponse {
    id: number
    name: string,
    description: string,
    state: number,
}

interface IParams { };

async function getGames({}: IParams) {
    let response = await fetch('http://localhost:5072/game');
    if(!response.ok)
        throw new Error(response.statusText);
    let data = await response.json() as IGameResponse[];
    let games = data.map<IGame>(gameResponse => {
        let state: keyof IGameState;
        switch(gameResponse.state) {
            case 0:
                state = "register";
                break;
            case 1:
                state = "inprogress";
                break;
            case 2:
            default:
                state = "complete";
        }
        return {
            ...gameResponse,
            state,
        }
    });
    return games;
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
