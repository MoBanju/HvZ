import { PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addChatMsg, updatePlayerState } from "../../store/slices/gameSlice";

interface IParams {
    gameId: number
    newUser: PutPlayerRequest
}
export interface PutPlayerRequest {
    id: number,
    isHuman: boolean,
    biteCode: string,
    isPatientZero: boolean
}


export async function PutPlayerType({gameId, newUser}: IParams) {
    let body = {
        "id": newUser.id,
        "isHuman": newUser.isHuman,
        "biteCode": newUser.biteCode,
        "isPatientZero": newUser.isPatientZero
    }


    const response: any = await fetch("https://localhost:7072/game/" + gameId + "/Players/" + newUser.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error("Couldnt update usertype")
    }
    const data = await response.json() as IPlayer
    return data


}

export const PutPlayerTypeAction: (gameId: number, newUser: PutPlayerRequest) => PayloadAction<RequestPayload<IParams, IPlayer>> = (gameId: number, newUser: PutPlayerRequest) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: updatePlayerState,
        params: { gameId, newUser },
        request: PutPlayerType,
        requestName: RequestsEnum.PutPlayerType,
    },
});

