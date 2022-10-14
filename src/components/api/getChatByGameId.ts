import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { setChat } from "../../store/slices/gameSlice";
import getAuthHeaders from "./setAuthHeaders";

export interface IChatResponse {
    id: number,
    message: string,
    chatTime: string,
    isHumanGlobal: boolean,
    isZombieGlobal: boolean,
    playerId: number,
}

interface IParams {
    gameId: number,
}

async function GetChatByGameId({gameId}: IParams): Promise<IChatResponse[]> {
    const headers = await getAuthHeaders();
    let response = await fetch(`${API_URL}/game/${gameId}/chat`, {
        headers,
    });
    if(!response.ok)
        throw new Error(await response.text() || response.statusText);
    let chatResponse = await response.json() as IChatResponse[];
    return chatResponse;
}

function GetChatByGameIdAction(gameId: number): PayloadAction<RequestPayload<IParams, IChatResponse[]>> {
    return {
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: setChat,
            request: GetChatByGameId,
            params: {gameId},
            requestName: RequestsEnum.GetChatByGameId,
        }
    };
};

export default GetChatByGameIdAction
