import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IKill } from "../../models/IKill";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { setKills } from "../../store/slices/killSlice";
import getAuthHeaders from "./setAuthHeaders";


interface IParams { 
    id: number
};

async function getKills({id}: IParams) {
    const headers = await getAuthHeaders();
    let response = await fetch(`${API_URL}/game/${id}/Kill`, {
        headers,
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let data = await response.json() as IKill[];
    return data;
}


// export function GetKillsAction(id: number): PayloadAction<RequestPayload<IParams, IKill[]>> {
//     return {
//         type: REQUEST_ACTION_TYPE,
//         payload: {
//             cbDispatch: setKills,
//             request: getKills,
//             params: {id},
//             requestName: RequestsEnum.GetKills,
//         }
//     };
// };


export default getKills;
