import { PayloadAction } from "@reduxjs/toolkit"
import { API_URL } from "../../constants/enviroment"
import { IMission } from "../../models/IMission"
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware"
import { addMission } from "../../store/slices/gameSlice"
import getAuthHeaders from "./setAuthHeaders"


export interface IPostMissionRequest {
    name: string,
    is_human_visible: boolean,
    is_zombie_visible: boolean,
    description?: string,
    start_time?: string,
    end_time?: string,
    latitude: number,
    longitude: number,
}

interface IParams {
    game_id: number
    mission: IPostMissionRequest
}


export async function PostMission({ game_id, mission }: IParams): Promise<IMission> {
    const headers = await getAuthHeaders()

    let response = await fetch(API_URL + "/game/" + game_id + "/Mission", {
        method: "POST",
        headers,
        body: JSON.stringify(mission)
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    let data = await response.json() as IMission

    return data
}



export const PostMissionInGameAction: (game_id: number, mission: IPostMissionRequest) => PayloadAction<RequestPayload<IParams, IMission>> = (game_id: number, mission: IPostMissionRequest) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: addMission,
        params: { game_id, mission },
        request: PostMission,
        requestName: RequestsEnum.PostMission,
    },
});

















/*
export interface IPostGameRequest {
    name: string,
    description: string,
    ne_lat: number,
    ne_lng: number,
    sw_lat: number,
    sw_lng: number,
    startTime: string,
    endTime: string
}

interface IParams {
    postGameRequest: IPostGameRequest,
}

async function postGame({postGameRequest}: IParams): Promise<IGame>{
    const headers = await getAuthHeaders();

    let response = await fetch(`${API_URL}/game`, {
        method: "POST",
        headers,
        body: JSON.stringify(postGameRequest),
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let createdGame = await response.json() as IGame;
    return createdGame;
};
*/