import { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { API_URL } from "../../constants/enviroment";
import getAuthHeaders from "./setAuthHeaders";
import { addKill } from "../../store/slices/gameSlice";
import { IKillResponse } from "./getKillsByGameId";

interface IParams {
    gameId: number,
    killRequest: IKillRequest
}

export interface IKillRequest {
    timeDeath: string,
    killerId: number,
    biteCode: string,
    latitude?: number,
    longitude?: number,
    description: string,
}

async function postKillRequest({ gameId, killRequest }: IParams) {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + gameId + "/kill", {
        method: "POST",
        headers,
        body: JSON.stringify(killRequest)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    const data = await response.json() as IKillResponse;
    return data;
}

export function PostKillAction(gameId: number, killRequest: IKillRequest, sideEffect: () => void): PayloadAction<RequestPayload<IParams, IKillResponse>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addKill,
            params: { gameId, killRequest },
            request: postKillRequest,
            requestName: RequestsEnum.PostKill,
            sideEffect,
        },
    }
};