import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import keycloak from "../../keycloak";
import { ISquad } from "../../models/ISquad";
import { ISquadMember } from "../../models/ISquadMember";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addSquadMember } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameId: number,
    squadId: number,
    squadMember: PostPlayerInSquadRequest
}

export interface PostPlayerInSquadRequest {
    playerId: number,
    rank: string
}

export async function postPlayerInSquad({gameId, squadId, squadMember}: IParams): Promise<ISquadMember>{
    let response = await fetch(`${API_URL}/game/${gameId}/Squad/${squadId}/join`, {
        method: "POST",
        headers: 
            await getAuthHeaders()
        ,
        body: JSON.stringify(squadMember),
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let joinedMember = await response.json() as ISquadMember;
    if(keycloak.tokenParsed?.sub){
        return {
            playerId: joinedMember.playerId,
            rank: joinedMember.rank
        }; 
    }
    throw new Error("Post player in squad failed")
}

export const PostPlayerInSquadAction: (gameId: number, squadId: number, squadMember: ISquadMember) => PayloadAction<RequestPayload<IParams, ISquadMember>> = (gameId: number, squadId: number, squadMember: ISquadMember) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: addSquadMember,
        params: {gameId, squadId, squadMember},
        request: postPlayerInSquad,
        requestName: RequestsEnum.postPlayerInSquad,
    }, 
});