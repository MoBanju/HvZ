import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { ICheckin } from "../../models/ICheckin";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE, sideEffect } from "../../store/middleware/requestMiddleware";
import { addCheckin } from "../../store/slices/gameSlice";
import { IGetCheckinResponse } from "./getCheckin";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameId: number,
    squadId: number,
    request: IPostCheckinRequest
}

export interface IPostCheckinRequest {
    start_time : string,
    end_time : string,
    latitude : number,
    longitude : number,
    squad_MemberId : number
}


async function postCheckin({ gameId, squadId, request }: IParams): Promise<ICheckin> {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + gameId + "/Squad/" + squadId + "check-in", {
        method: "POST",
        headers,
        body: JSON.stringify(request)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    const data = await response.json() as IGetCheckinResponse;
    return data;
}

export function PostCheckinAction(gameId: number, squadId: number, request: IPostCheckinRequest, sideEffect: sideEffect): PayloadAction<RequestPayload<IParams, ICheckin>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addCheckin,
            params: { gameId, squadId, request },
            request: postCheckin,
            requestName: RequestsEnum.PostCheckin,
            sideEffect,
        },
    }
};