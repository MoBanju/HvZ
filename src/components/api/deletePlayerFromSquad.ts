
import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react'
import { API_URL } from '../../constants/enviroment';
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from '../../store/middleware/requestMiddleware';
import getAuthHeaders from './setAuthHeaders';
import { deleteFromSquad } from "../../store/slices/gameSlice";




interface IParams{
    game_id: number,
    squad_id: number,
    player_id: number,
}


async function deletePlayerFromSquad({ game_id, squad_id, player_id }: IParams) {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + game_id + "/Squad/" + squad_id + "/" + player_id, {
        headers,
        method: "DELETE",
    });
    if(!response.ok){
        throw new Error(await response.text() || response.statusText)
    }
    return [game_id, squad_id, player_id]
}


export function DeletePlayerFromSquadAction(game_id: number, squad_id: number, player_id: number): PayloadAction<RequestPayload<IParams, number[]>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: deleteFromSquad,
            params: { game_id, squad_id, player_id },
            request: deletePlayerFromSquad,
            requestName: RequestsEnum.DeletePlayerFromSquad,
        },
    }
}



export default DeletePlayerFromSquadAction