import { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { setGame } from "../../store/slices/gameSlice";
import GetGameById from "./getGameById";
import getPlayersByGameId from "./getPlayersByGameId";

interface IParams {
    id: number,
}

async function getGameAndPlayerByGameIdRequest({ id }: IParams) {
    let game = await GetGameById({id});
    let players = await getPlayersByGameId({id});
    return {
        game,
        players,
    }
}




export function GetGameAndPlayersByGameIdAction(id: number): PayloadAction<RequestPayload<IParams, {game: IGame, players: IPlayer[]}>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: setGame,
            params: {id},
            request: getGameAndPlayerByGameIdRequest,
            requestName: RequestsEnum.GetGameAndPlayerByGameId,
        },
    }
};
