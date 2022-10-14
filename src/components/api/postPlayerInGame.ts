import { PayloadAction } from "@reduxjs/toolkit";
import keycloak from "../../keycloak";
import { IPlayer } from "../../models/IPlayer"
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addPlayer } from "../../store/slices/gameSlice";
import { IGameResponse } from "./getGames";
import { IPlayerResponse } from "./getPlayersByGameId";
import getAuthHeaders from "./setAuthHeaders";

export interface PostPlayerInGameRequest {
    isPatientZero: boolean,
    isHuman: boolean,
    biteCode: string,
    user: {
        keyCloakId: string,
        firstName: string,
        lastName: string
    }
}

interface IParams {
    gameId: number,
    player: PostPlayerInGameRequest
}

async function postPlayerInGame({gameId, player}: IParams): Promise<IPlayer>{
    let body: PostPlayerInGameRequest = {
        isPatientZero: player.isPatientZero,
        isHuman: player.isHuman,
        biteCode: player.biteCode,
        user: player.user
    };

    let response = await fetch(`http://localhost:5072/game/${gameId}/Player`, {
        method: "POST",
        headers: 
            await getAuthHeaders()
        ,
        body: JSON.stringify(body),
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let createdPlayer = await response.json() as IPlayerResponse;
    console.log(createdPlayer)
    if(keycloak.tokenParsed?.sub){
        return {
            id: createdPlayer.id,
            isPatientZero: createdPlayer.isPatientZero,
            isHuman: createdPlayer.isHuman,
            biteCode: createdPlayer.biteCode,
            user: {
                keyCloakId: keycloak.tokenParsed.sub,
                firstName: createdPlayer.user.firstName,
                lastName: createdPlayer.user.lastName,
            }
        }; 
    }
    throw new Error("Post player ingame failed")
}


export const PostPlayerInGameAction: (gameId: number, player: IPlayer) => PayloadAction<RequestPayload<IParams, IPlayer>> = (gameId: number, player: IPlayer) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: addPlayer,
        params: {gameId, player},
        request: postPlayerInGame,
        requestName: RequestsEnum.postPlayerInGame,
    }, 
});