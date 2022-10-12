import { PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "../../constants/enviroment";
import { IChat } from "../../models/IChat";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addChatMsg } from "../../store/slices/gameSlice";
import { IChatResponse } from "./getChatByGameId";
import getAuthHeaders from "./setAuthHeaders";

export interface PostChatMessageRequst {
    message: string,
    isHumanGlobal: boolean,
    isZombieGlobal: boolean,
    chatTime: string,
    playerId: number,
}

interface IParams {
    gameId: number,
    chatMsg: IChat,
}

async function postChatMessage({gameId, chatMsg}: IParams): Promise<IChat>{
    const headers = await getAuthHeaders();
    // Have to exclude if from chatMsg
    let body: PostChatMessageRequst = {
        message: chatMsg.message,
        chatTime: chatMsg.chatTime,
        isHumanGlobal: chatMsg.isHumanGlobal,
        isZombieGlobal: chatMsg.isZombieGlobal,
        playerId: chatMsg.player.id,
    };
    let response = await fetch(`${API_URL}/game/${gameId}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if(!response.ok)
        throw new Error(response.statusText);
    let createdChat = await response.json() as IChatResponse;
    return {
        id: createdChat.id,
        chatTime: chatMsg.chatTime,
        isHumanGlobal: chatMsg.isHumanGlobal,
        isZombieGlobal: chatMsg.isZombieGlobal,
        message: chatMsg.message,
        player: chatMsg.player,
    }
};


export const PostChatMessageAction: (gameId: number, chatMsg: IChat, sideEffect: () => void) => PayloadAction<RequestPayload<IParams, IChat>> = (gameId: number, chatMsg: IChat, sideEffect: () => void) => ({
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addChatMsg,
            params: {gameId, chatMsg},
            request: postChatMessage,
            requestName: RequestsEnum.PostChatMessage,
            sideEffect,
        },
    });