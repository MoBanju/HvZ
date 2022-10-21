import { PayloadAction } from '@reduxjs/toolkit'
import { API_URL } from '../../constants/enviroment'
import { IMission } from '../../models/IMission'
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from '../../store/middleware/requestMiddleware'
import { setMissions } from '../../store/slices/gameSlice'
import getAuthHeaders from './setAuthHeaders'


interface IParams {
    game_id: number
}
//mangler: This should only return missions that are faction appropriate.

export async function getMissions({ game_id }: IParams) {
    const headers = await getAuthHeaders()
    let response = await fetch(API_URL + "/game/" + game_id + "/Mission", {
        headers
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    const data = await response.json() as IMission[]
    return data
}


export const GetMissionsAction: (game_id: number) => PayloadAction<RequestPayload<IParams, IMission[]>> = (game_id: number) => ({
    type: REQUEST_ACTION_TYPE,
    payload: {
        cbDispatch: setMissions,
        params: { game_id },
        request: getMissions,
        requestName: RequestsEnum.GetMissions,
    },
});




