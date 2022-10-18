import { API_URL } from "../../constants/enviroment";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
   id: number,
}

export interface IKillResponse {
    id: number;
    timeDeath: string;
    latitude: number;
    longitude: number;
    description: string;
    playerKills: ({
        isVictim: boolean;
        killId: number;
        playerId: number;
    })[]
}

async function getKillsByGameId({ id: gameId }: IParams) {
    const headers = await getAuthHeaders();
    let response = await fetch(`${API_URL}/game/${gameId}/Kill`, {
        headers
    });
    if (!response.ok)
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as IKillResponse[];
    return data;
}


export default getKillsByGameId;