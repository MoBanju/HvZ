import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { deleteMission } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";



interface IParams {
    game_id: number,
    mission_id: number
}


async function DeleteMissionById({ game_id, mission_id }: IParams) {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + game_id + "/Mission/" + mission_id, {
        headers,
        method: "DELETE",
    });
    if (!response.ok)
        throw new Error("DeleteMissionById request failed");

    return mission_id;
}


export function DeleteMissionByIdAction(game_id: number, mission_id: number): PayloadAction<RequestPayload<IParams, number>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: deleteMission,
            params: { game_id, mission_id },
            request: DeleteMissionById,
            requestName: RequestsEnum.DeleteMissionById,
        },
    }
}
