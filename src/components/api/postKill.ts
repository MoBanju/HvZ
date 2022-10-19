import { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { API_URL } from "../../constants/enviroment";
import getAuthHeaders from "./setAuthHeaders";
import getPlayerById from "./getPlayerById";
import { updatePlayerState } from "../../store/slices/gameSlice";

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

interface IPostKillResponse {
    id: number,
    playerKills: {
        isVictim: boolean,
        killId: number,
        playerId: number,
    }[]
    timeDeath: string,
}

async function postKillRequest({ gameId, killRequest }: IParams): Promise<IPlayer> {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + gameId + "/kill", {
        method: "POST",
        headers,
        body: JSON.stringify(killRequest)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    const data = await response.json() as IPostKillResponse;
    const player = await getPlayerById({ gameId, playerId: data.playerKills[0].playerId })
    player.isHuman = false;
    return player;
}

export function PostKillAction(gameId: number, killRequest: IKillRequest, sideEffect: () => void): PayloadAction<RequestPayload<IParams, IPlayer>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: updatePlayerState,
            params: { gameId, killRequest },
            request: postKillRequest,
            requestName: RequestsEnum.PostKill,
            sideEffect,
        },
    }
};