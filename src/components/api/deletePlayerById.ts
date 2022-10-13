import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { deletePlayer } from "../../store/slices/gameSlice";
import { removeGame } from "../../store/slices/gamesSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameid: number,
    playerid: number
}


async function deletePlayerById({ gameid, playerid }: IParams) {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + gameid + "/Players/" + playerid, {
        headers,
        method: "DELETE",
    });
    if(!response.ok)
        throw new Error(response.statusText);
    return playerid;
}

export function DeletePlayerByIdAction(gameid: number, playerid: number): PayloadAction<RequestPayload<IParams, number>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: deletePlayer,
            params: { gameid, playerid },
            request: deletePlayerById,
            requestName: RequestsEnum.DeletePlayerById,
        },
    }
};