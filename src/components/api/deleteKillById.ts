
import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE, sideEffect } from "../../store/middleware/requestMiddleware";
import { deleteKill } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameid: number,
    killid: number
}


async function deleteKillById({ gameid, killid }: IParams) {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + gameid + "/kill/" + killid, {
        headers,
        method: "DELETE",
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    return killid;
}

export function DeleteKillByIdAction(gameid: number, killid: number, sideEffect: sideEffect): PayloadAction<RequestPayload<IParams, number>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: deleteKill,
            params: { gameid, killid },
            request: deleteKillById,
            requestName: RequestsEnum.DeleteKillById,
            sideEffect,
        },
    }
};