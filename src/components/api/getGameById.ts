import { API_URL } from "../../constants/enviroment";
import { IGame } from "../../models/IGame";
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
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as IGame;
    return data;
}

export default GetGameById;