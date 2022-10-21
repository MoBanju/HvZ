import { API_URL } from "../../constants/enviroment";
import { ICheckin } from "../../models/ICheckin";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameId: number,
    squadId: number,
}

export interface IGetCheckinResponse {
    id: number,
    start_time : string,
    end_time : string,
    latitude : number,
    longitude : number,
    squad_MemberId : number
}


export async function getCheckin({ gameId, squadId }: IParams): Promise<ICheckin[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(API_URL + "/game/" + gameId + "/Squad/" + squadId + "/check-in", {
        headers,
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    const data = await response.json() as IGetCheckinResponse[];
    return data;
}