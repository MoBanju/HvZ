import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import keycloak from "../../keycloak";
import { IPlayer } from "../../models/IPlayer"
import { ISquad } from "../../models/ISquad";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addPlayer, addSquad } from "../../store/slices/gameSlice";
import { IPlayerResponse } from "./getPlayersByGameId";
import { ISquadResponse } from "./getSquadsByGameId";
import getAuthHeaders from "./setAuthHeaders";

export interface PostSquadInGameRequest {
    name: string,
    is_human: boolean,
    squadMember: {
        rank: string,
        playerId: number
    }
}

interface IParams {
    gameId: number,
    squad: PostSquadInGameRequest
}


async function postSquad({gameId, squad}: IParams): Promise<ISquad>{
    let response = await fetch(`${API_URL}/game/${gameId}/Squad`, {
        method: "POST",
        headers: 
            await getAuthHeaders()
        ,
        body: JSON.stringify(squad),
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let createdSquad = await response.json() as ISquadResponse;
    if(keycloak.tokenParsed?.sub){
        return {
            id: createdSquad.id,
            name: createdSquad.name,
            is_human: createdSquad.is_human,
            deseasedPlayers: createdSquad.deseasedPlayers,
            squadMember: [{
                rank: createdSquad.squadMember.rank,
                playerId: createdSquad.squadMember.playerId
            }]
        };
    }  
    throw new Error("Post squad ingame failed")
}


export const PostSquadAction: (gameId: number, squad: PostSquadInGameRequest) => PayloadAction<RequestPayload<IParams, ISquad>> = (gameId: number, squad: PostSquadInGameRequest) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: addSquad,
        params: {gameId, squad},
        request: postSquad,
        requestName: RequestsEnum.PostSquad
    }, 
});