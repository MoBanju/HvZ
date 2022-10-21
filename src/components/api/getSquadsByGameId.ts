import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IPlayer } from "../../models/IPlayer";
import { ISquad } from "../../models/ISquad";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import getAuthHeaders from "./setAuthHeaders";


interface IParams {
    id: number,
}



async function getSquadsByGameId({ id }: IParams ) {
    const headers = await getAuthHeaders();
    let response = await fetch(`${API_URL}/game/${id}/Squad`, {
        headers
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as ISquad[];
    return data;
}

export default getSquadsByGameId;