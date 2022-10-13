import { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { API_URL } from "../../constants/enviroment";
import getAuthHeaders from "./setAuthHeaders";
import getPlayerById from "./getPlayerById";
import { updatePlayerState } from "../../store/slices/gameSlice";

interface IParams {
    gameId: number,
    killer: IPlayer,
    biteCode: string
}

interface IKillRequest {
    timeDeath: string,
    killerId: number,
    biteCode: string,
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

async function postKillRequest({ gameId, killer, biteCode }: IParams): Promise<IPlayer> {
    const headers = await getAuthHeaders();
    let body: IKillRequest = {
        timeDeath: new Date().toJSON(),
        killerId: killer.id,
        biteCode,
    }
    const response = await fetch( API_URL + "/game/" + gameId + "/kill", {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(await response.text())
    }
    const data = await response.json() as IPostKillResponse;
    const player = await getPlayerById({gameId, playerId: data.playerKills[0].playerId})
    player.isHuman = false;
    return player;
}

export function PostKillAction(gameId: number, killer: IPlayer, biteCode: string, sideEffect: () => void): PayloadAction<RequestPayload<IParams, IPlayer>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: updatePlayerState,
            params: { gameId, killer, biteCode },
            request: postKillRequest,
            requestName: RequestsEnum.PostKill,
            sideEffect,
        },
    }
};