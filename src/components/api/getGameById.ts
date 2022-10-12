import { API_URL } from "../../constants/enviroment";
import { IGameResponse } from "./getGames";
import getAuthHeaders from "./setAuthHeaders";

interface IParams {
    id: number
};

async function GetGameById({id}: IParams) {
    const headers = await getAuthHeaders();
    let response = await fetch(API_URL + '/game/' + id, {
        headers
    });
    if(!response.ok)
        throw new Error(response.statusText);
    let data = await response.json() as IGameResponse;
    return data;
}

export default GetGameById;