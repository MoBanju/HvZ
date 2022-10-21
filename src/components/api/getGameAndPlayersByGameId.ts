import { PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../models/IGame";
import { IPlayer } from "../../models/IPlayer";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE, sideEffect } from "../../store/middleware/requestMiddleware";
import GetGameById from "./getGameById";
import getKillsByGameId from "./getKillsByGameId";
import getPlayersByGameId from "./getPlayersByGameId";
import {IKill} from "../../models/IKill"
import React from 'react';
import getSquadsByGameId from "./getSquadsByGameId";
import { ISquad } from "../../models/ISquad";
import { getMissions } from "./getMissions";
import { IMission } from "../../models/IMission";
import { setGameState } from "../../store/slices/gameSlice";

interface IParams {

    id: number,
}

async function getGameState({ id }: IParams) {
    let game          = await GetGameById({id});
    let players       = await getPlayersByGameId({id});
    let killsResponse = await getKillsByGameId({id});
    let missions      = await getMissions({game_id: id});
    let squads = await getSquadsByGameId({id})
    let kills = killsResponse
        .filter((killResponse: { playerKills: { playerId: number; }[]; }) => {
            if(killResponse.playerKills.length !== 2)
                return false;
            if(!players.some(p => p.id === killResponse.playerKills[0].playerId))
                return false;
            if(!players.some(p => p.id === killResponse.playerKills[1].playerId))
                return false;
            return true;
        }) 
        .map<IKill>((killResponse: { playerKills: { playerId: number; }[]; id: any; description: any; latitude: any; longitude: any; timeDeath: any; }) => {
            let killer = players.find(p => p.id === killResponse.playerKills[0].playerId)!
            let victim = players.find(p => p.id === killResponse.playerKills[1].playerId)!
            return {
                id: killResponse.id,
                description: killResponse.description,
                latitude: killResponse.latitude,
                longitude: killResponse.longitude,
                killer: killer,
                victim: victim,
                timeDeath: killResponse.timeDeath,
            }
        });
    return {
        game,
        players,
        kills,
        squads,
        missions,
    }
}





export function getGameStateAction(id: number, initialeRequest: boolean, sideEffect: sideEffect): PayloadAction<RequestPayload<IParams, {game: IGame, players: IPlayer[], kills: IKill[], missions: IMission[], squads: ISquad[] }>> {
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
