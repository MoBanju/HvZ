import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment"
import { IMission } from "../../models/IMission"
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE, sideEffect } from "../../store/middleware/requestMiddleware";
import { updateMission } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders"


interface IParams {
    game_id: number,
    mission_id: number,
    mission: IMission,
}



async function PutMission({ game_id, mission_id, mission }: IParams): Promise<IMission> {
    const headers = await getAuthHeaders(); //kan jo fjerne mission_id (og game_id men da må inputen bli annerledes)

    const response = await fetch(API_URL + "/game/" + game_id + "/Mission/" + mission_id, {
        method: "PUT",
        headers,
        body: JSON.stringify(mission)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }

    return mission
}


export function PutMissionAction(game_id: number, mission_id: number, mission: IMission, sideEffect: sideEffect): PayloadAction<RequestPayload<IParams, IMission>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: updateMission,
            params: { game_id, mission_id, mission },
            request: PutMission,
            requestName: RequestsEnum.PutMission,
            sideEffect,
        }

    }
}