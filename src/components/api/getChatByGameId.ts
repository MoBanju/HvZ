import { PayloadAction } from "@reduxjs/toolkit";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { setChat } from "../../store/slices/gameSlice";

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
    let response = await fetch(`http://localhost:5072/game/${gameId}/chat`);
    if(!response.ok)
        throw new Error(response.statusText);
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
