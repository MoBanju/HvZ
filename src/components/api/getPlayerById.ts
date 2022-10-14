import { API_URL } from "../../constants/enviroment";
import { IPlayer } from "../../models/IPlayer";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    gameId: number,
    playerId: number,
}

async function getPlayerById({ gameId, playerId }: IParams ) {
    const headers = await getAuthHeaders();
    let response = await fetch(`${API_URL}/game/${gameId}/Player/${playerId}`, {
        headers
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as IPlayer;
    return data;
}

export default getPlayerById;