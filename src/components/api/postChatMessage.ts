import { PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "../../models/IChat";
import { RequestPayload, RequestsEnum, REQUEST_ACTION_TYPE } from "../../store/middleware/requestMiddleware";
import { addChatMsg } from "../../store/slices/gameSlice";
import { IChatResponse } from "./getChatByGameId";

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
    // Have to exclude if from chatMsg
    let body: PostChatMessageRequst = {
        message: chatMsg.message,
        chatTime: chatMsg.chatTime,
        isHumanGlobal: chatMsg.isHumanGlobal,
        isZombieGlobal: chatMsg.isZombieGlobal,
        playerId: chatMsg.player.id,
    };
    let response = await fetch(`http://localhost:5072/game/${gameId}/chat`, {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
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


export const PostChatMessageAction: (gameId: number, chatMsg: IChat) => PayloadAction<RequestPayload<IParams, IChat>> = (gameId: number, chatMsg: IChat) => ({
        type: REQUEST_ACTION_TYPE,
        payload: {
            cbDispatch: addChatMsg,
            params: {gameId, chatMsg},
            request: postChatMessage,
            requestName: RequestsEnum.PostChatMessage,
        },
    });