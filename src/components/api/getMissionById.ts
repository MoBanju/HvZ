

import React from 'react'
import { API_URL } from '../../constants/enviroment'
import { IMission } from '../../models/IMission'
import getAuthHeaders from './setAuthHeaders'


interface IParams {
    mission_id: number,
    game_id: number,

}
//mangler:  Returns 403 Forbidden if a human requests a zombie mission and vise versa.

async function getMissionById({ mission_id, game_id }: IParams) {
    const headers = await getAuthHeaders()
    let response = await fetch(API_URL + "/game/" + game_id + "/Mission/" + mission_id, {
        headers
    })
    if (!response.ok) {
        throw new Error(await response.text() || response.statusText)
    }
    let data = await response.json() as IMission

    return data
}

export default getMissionById



