import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IKill } from "../../models/IKill";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { updateKill } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameId: number,
    updatedKill: IKill,
}

interface IPutKillRequest {
  id: number,
  timeDeath: string,
  latitude?: number,
  longitude?: number,
  description?: string,
}

async function putKillById({ gameId, updatedKill}: IParams) {
    const body: IPutKillRequest = {
        id: updatedKill.id,
        timeDeath: updatedKill.timeDeath,
        description: updatedKill.description,
        longitude: updatedKill.longitude,
        latitude: updatedKill.latitude,
    }
    const headers = await getAuthHeaders();
    const response= await fetch( API_URL + "/game/" + gameId + "/Kill/" + updatedKill.id, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    return updatedKill;
}

export function PutKillAction(gameId: number, updatedKill: IKill): PayloadAction<RequestPayload<IParams, IKill>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: updateKill,
            params: { gameId, updatedKill},
            request: putKillById,
            requestName: RequestsEnum.PutKillById,
        },
    }
};