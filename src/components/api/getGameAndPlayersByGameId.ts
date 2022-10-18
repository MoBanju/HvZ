import { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IKill } from "../../models/IKill";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { setGamePlayersAndKills } from "../../store/slices/gameSlice";
import GetGameById from "./getGameById";
import getKillsByGameId from "./getKillsByGameId";
import getPlayersByGameId from "./getPlayersByGameId";

interface IParams {
    id: number,
}

async function getGamePlayerAndKillsByGameIdRequest({ id }: IParams) {
    let game = await GetGameById({id});
    let players = await getPlayersByGameId({id});
    let killsResponse = await getKillsByGameId({id})
    let kills = killsResponse
    .filter(killResponse => {
        if(!players.some(p => p.id === killResponse.playerKills[0].playerId))
            return false;
        if(!players.some(p => p.id === killResponse.playerKills[1].playerId))
            return false;
        return true;
    }) 
    .map<IKill>((killResponse) => {
        let killer = players.find(p => p.id === killResponse.playerKills[0].playerId)!
        let victim = players.find(p => p.id === killResponse.playerKills[1].playerId)!
        return {
            id: killResponse.id,
            description: killResponse.description,
            latitude: killResponse.latitude,
            longitude: killResponse.longitude,
            killer: killer,
            victirm: victim,
            timeDeath: killResponse.timeDeath,
        }
    });
    return {
        game,
        players,
        kills,
    }
}





export function GetGameAndPlayersByGameIdAction(id: number): PayloadAction<RequestPayload<IParams, {game: IGame, players: IPlayer[], kills: IKill[] }>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: setGamePlayersAndKills,
            params: {id},
            request: getGamePlayerAndKillsByGameIdRequest,
            requestName: RequestsEnum.GetGamePlayerAndKillsByGameId,
        },
    }
};
