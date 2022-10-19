import { PayloadAction } from "@reduxjs/toolkit"
import { API_URL } from "../../constants/enviroment"
import { IMission } from "../../models/IMission"
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware"
import getAuthHeaders from "./setAuthHeaders"



interface IParams {
    game_id: number
    mission: IMission
}

//Mangler: lage postRequestInterface(?)


export async function PostMission({ game_id, mission }: IParams): Promise<IMission> {
    const headers = await getAuthHeaders()

    let response = await fetch(API_URL + "/game/" + game_id + "mission", {
        method: "POST",
        headers,
        body: JSON.stringify(mission)
    })
    if (!response.ok) {
        throw new Error("couldnt post missions")
    }
    let data = await response.json() as IMission

    return data
}



/*
export const PostMissionInGameAction: ({game_id, mission}:IParams) => PayloadAction<RequestPayload<IParams, IMission>> = (gameId: number, mission: IMission) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: addMission,
        params: {gameId, mission},
        request: PostMission,
        requestName: RequestsEnum.PostMission,
    }, 
});

*/















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