import { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { updatePlayerState } from "../../store/slices/gameSlice";
import { API_URL } from "../../constants/enviroment";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameId: number
    newUser: IPlayer
}

export async function PutPlayerType({ gameId, newUser }: IParams): Promise<IPlayer> {
    const headers = await getAuthHeaders();
    let body = {
        "id": newUser.id,
        "isHuman": newUser.isHuman,
        "biteCode": newUser.biteCode,
        "isPatientZero": newUser.isPatientZero
    }
    const response= await fetch( API_URL + "/game/" + gameId + "/Player/" + newUser.id, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    return newUser;
}

export const PutPlayerTypeAction: (gameId: number, newUser: IPlayer) => PayloadAction<RequestPayload<IParams, IPlayer>> = (gameId: number, newUser: IPlayer) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: updatePlayerState,
        params: { gameId, newUser },
        request: PutPlayerType,
        requestName: RequestsEnum.PutPlayerType,
    },
});

