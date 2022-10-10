import { IPlayer } from "../../models/IPlayer";

async function getPlayersByGameId(id: number) {
    let response = await fetch(`http://localhost:5072/game/${id}/Players`);
    if(!response.ok)
        throw new Error(response.statusText);
    let data = await response.json() as IPlayer[];
    return data;
}

export default getPlayersByGameId;