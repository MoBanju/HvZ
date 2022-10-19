import { API_URL } from "../../constants/enviroment"
import { IMission } from "../../models/IMission"
import getAuthHeaders from "./setAuthHeaders"


interface IParams {
    game_id: number,
    mission_id: number,
    mission: IMission,
}

export async function PutMission({ game_id, mission_id, mission }: IParams): Promise<IMission> {
    const headers = await getAuthHeaders();

    const response = await fetch(API_URL + "/game/" + game_id + "/Mission/" + mission_id, {
        method: "PUT",
        headers,
        body: JSON.stringify(mission)
    })
    if (!response.ok) {
        throw new Error("putmission not working")
    }
    return mission
}


