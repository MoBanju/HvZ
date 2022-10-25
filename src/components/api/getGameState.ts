import { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE, sideEffect } from "../../store/middleware/requestMiddleware";
import GetGameById from "./getGameById";
import getKillsByGameId, { IKillResponse } from "./getKillsByGameId";
import getPlayersByGameId from "./getPlayersByGameId";
import {IKill} from "../../models/IKill"
import getSquadsByGameId from "./getSquadsByGameId";
import { ISquad } from "../../models/ISquad";
import { getMissions } from "./getMissions";
import { IMission } from "../../models/IMission";
import { setGameState } from "../../store/slices/gameSlice";
import keycloak from "../../keycloak";
import { getCheckin } from "./getCheckin";
import { ICheckin } from "../../models/ICheckin";

interface IParams {

    id: number,
}

export type GameState = {
    game: IGame,
    players: IPlayer[],
    kills: IKill[],
    missions: IMission[],
    squads: ISquad[],
    checkins: ICheckin[],
    currentPlayer: IPlayer | undefined,
}

async function getGameState({ id }: IParams): Promise<GameState> {
    let sub = keycloak.tokenParsed?.sub;
    let isAdmin = keycloak.realmAccess?.roles.includes("ADMIN")
    if(!sub) throw new Error("No keycloak token when fetching game state");
    let game          = await GetGameById({id});
    let players       = await getPlayersByGameId({id});
    let killsResponse = await getKillsByGameId({id});
    let missionsResponse= await getMissions({game_id: id});
    let squads          = await getSquadsByGameId({id})

    let kills = killsResponse
    .filter((killResponse) => {
        if(killResponse.playerKills.length !== 2)
            return false;
        if(!killResponse.playerKills.some(playerKill => playerKill.isVictim))
            return false;
        if(!killResponse.playerKills.some(playerKill => !playerKill.isVictim))
            return false;
        if(!players.some(p => p.id === killResponse.playerKills[0].playerId))
            return false;
        if(!players.some(p => p.id === killResponse.playerKills[1].playerId))
            return false;
        return true;
    }) 
    .map<IKill>((killResponse: IKillResponse)=> {
        let killer = players.find(p => p.id === killResponse.playerKills[1].playerId)!
        let victim = players.find(p => p.id === killResponse.playerKills[0].playerId)!
        if(killResponse.playerKills[1].isVictim) {
            let tmp = killer;
            killer = victim;
            victim = tmp;
        }
        return {
            ...killResponse,
            killer,
            victim,
        }
    });
    const currentPlayer = players.find(player => player.user.keyCloakId === sub);
    if(isAdmin) {
        return {
            game,
            players,
            kills,
            missions: missionsResponse,
            checkins: [],
            squads,
            currentPlayer: currentPlayer,
        }
    }
    if(!currentPlayer)
        return {
            game,
            players,
            kills,
            missions: [],
            checkins: [],
            squads,
            currentPlayer,
        }
    let missions = missionsResponse.filter(mission => {
        if(currentPlayer.isHuman && mission.is_human_visible)
            return true;
        if(!currentPlayer.isHuman && mission.is_zombie_visible)
            return true;
        return false;
    });
    let [squadId, squadMemberId] = findSquadAndSquadMemberId(squads, currentPlayer);
    if(!squadId || !squadMemberId)
        return {
            game,
            players,
            kills,
            checkins: [],
            missions: missions,
            squads,
            currentPlayer,
        }

    currentPlayer.squadId = squadId;
    currentPlayer.squadMemberId = squadMemberId;
    let checkins = await getCheckin({gameId: id, squadId: squadId});
    return {
        game,
        players,
        kills,
        squads,
        missions,
        currentPlayer,
        checkins,
    }
}

function findSquadAndSquadMemberId(squads: ISquad[], currentPlayer: IPlayer) {
    for(let i=0; i < squads.length; i++) {
        for(let j=0; j < squads[i].squad_Members.length; j++) {
            if(squads[i].squad_Members[j].playerId === currentPlayer.id) {
                return [squads[i].id, squads[i].squad_Members[j].id];
            }
        }
    }
    return [undefined, undefined];
}





export function getGameStateAction(id: number, initialeRequest: boolean, sideEffect: sideEffect): PayloadAction<RequestPayload<IParams, GameState>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: setGameState,
            params: {id},
            request: getGameState,
            requestName: initialeRequest ? RequestsEnum.GetGameStateInital : RequestsEnum.GetGameStatePeriodicaly,
            sideEffect
        },
    }
};
