import { API_URL } from "../../constants/enviroment";
import { IPlayer } from "../../models/IPlayer";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    id: number,
}

async function getPlayersByGameId({ id }: IParams ) {
    const headers = await getAuthHeaders();
    let response = await fetch(`${API_URL}/game/${id}/Players`, {
        headers
    });
    if(!response.ok)
        throw new Error(response.statusText);
    let data = await response.json() as IPlayer[];
    return data;
}

export default getPlayersByGameId;