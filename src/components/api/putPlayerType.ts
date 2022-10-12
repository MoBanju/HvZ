import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { updatePlayerState } from "../../store/slices/gameSlice";
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
    const response: any = await fetch( API_URL + "/game/" + gameId + "/Players/" + newUser.id, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error("Couldnt update usertype")
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
